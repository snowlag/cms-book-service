var express = require("express"),
    router = express.Router(),
    AWS = require("aws-sdk"),
    uuid = require("uuid");
methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt"),
    keys = require("../../config/keys"),
    jwt = require("jsonwebtoken"),
    passport = require("passport");
request = require("request")
timestamp = require("../../controller/getTime"),
    GraphicalCounters = require("../../controller/GraphicalCounters");

//Body Parser -------------------
router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride("_method"));
router.use(bodyParser.json());


// Load Input Validation
const validateBookInput = require('../../Validation/book.js');
const validateCategoryInput = require('../../Validation/category.js');
const ValidateChapterInput = require('../../Validation/chapterInput.js')
const ValidateBulkInput = require('../../Validation/bulkinput.js');

//----------------------------------------------------------------------------------------------------
// -------------------------------------Aws Configuration------------------------------------------------------------
AWS.config.update({
    region: "ap-south-1",
    accessKeyId: keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();



//-----------------------------------------------------------------------------------------------------------------------------------------------------
//Path = /api/post/book
//Access = Private Route
//Method = Post
//Des = Route to add book
router.post("/api/post/book", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Validate the inputs    
        //Do Validation
        const { errors, isValid } = validateBookInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        var book_name = req.body.name;
        var author = req.body.author;
        var description = req.body.description;
        var subcategory_id = req.body.subcategory_id;
        var poster = req.body.poster;
        var id = uuid.v4();
        var type = req.body.type;
        var lang = req.body.language;
        var cat_id = req.body.cat_id;
        var category = req.body.category;
        var subcategory = req.body.subcategory

        var error = {};
        var success = {};
        var params = {

            TableName: keys.Table,
            Item: {
                "type": "A_Book",
                "id": id,
                "book_name": book_name,
                "author": author,
                "uploader_id": req.user.id,
                "User": req.user.Username,
                "description": description,
                "parent_id": subcategory_id,
                "poster": poster,
                "status": req.body.status,
                "timestamp": new Date().getTime(),
                "Category_id": cat_id,
                "lang": lang,
                "chapters": 0,
                "solutions": 0,
                "category": category ,
                "subcategory": subcategory
            }
        }
        if (req.body.tags) {
            params.Item.tags = req.body.tags.split(",")
        }
        console.log(params)
        docClient.put(params, function (err, data) {
            if (err) {
                error.message = "Error adding Book";
                return res.status(400).json(error);
            } else {
                //Add New Activity
                var act_id = uuid.v4();
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": act_id,
                        "user": req.user.Username,
                        "action": "Added",
                        "item": type,
                        "item_name": book_name,
                        "status": "Archived Book",
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())

                    }
                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        error.message = "Error updating Activity";
                        return res.status(400).json(errors);
                    } else {
                        var params = {
                            TableName: keys.Table,
                            Key: {
                                "type": "Counters",
                                "id": keys.CounterId
                            },
                            UpdateExpression: "ADD #counter :incva",
                            ExpressionAttributeNames: {
                                "#counter": "BookCount"
                            },
                            ExpressionAttributeValues: {
                                ":incva": 1
                            },
                            ReturnValues: "UPDATED_NEW"
                        };
                        docClient.update(params, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.status(400).json({ "message": "Error Updating Counter" })

                            } else {

                                try {
                                    var item = {}
                                    item.Book_id = id;
                                    GraphicalCounters.updateUserUploads(req, res, 1, item);
                                } catch (err) {
                                    console.log(err);
                                    return res.status(400).json({
                                        message: "Something went wrong"
                                    })
                                }

                            }
                        })
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Server error"
        })
    }
});

//----------------------------------------End of the Route------------------------------------------------------------------------------

//Path = /api/upload/booklink
//Access = Private
//Method = PUT
//Desc = This route is used when user add book link in the databse (This is not the edit Book file route)
router.put("/api/upload/booklink", passport.authenticate('jwt', { session: false }), (req, res) => {

    try {
        //Validate Book Link

        const url = req.body.url;
        request({
            url: url,
            method: "HEAD"
        }, function (err, response, body) {
            if (!err && response.headers['content-type'] &&
                (response.headers["content-type"] === "application/pdf" || response.headers["content-type"] === "application/octet-stream")) {
                var url = req.body.url
                const name = req.body.name;
                const id = req.body.id;
                const type = req.body.type;
                const download_type = req.body.medium;
                if (req.body.medium === "DirectLink") {
                    console.log("Updating");
                    GraphicalCounters.updateTotalFileUploads(req, res, 1);

                }
                var params = {
                    TableName: keys.Table,
                    Key: {
                        "type": type,
                        "id": id
                    },
                    UpdateExpression: "set #book_link = :u , #dtype = :d  ",
                    ExpressionAttributeNames: {
                        "#book_link": "url",
                        "#dtype": "medium"
                    },
                    ExpressionAttributeValues: {
                        ":u": url,
                        ":d": download_type,
                    },
                    ReturnValues: "UPDATED_NEW"
                }
                docClient.update(params, function (err, data) {
                    if (err) {
                        res.status(400).json({ "message": "Error Updating Table" });
                        console.log(err)
                    } else {
                        //Add new Activity
                        var act_id = uuid.v4();
                        var params = {
                            TableName: keys.Table,
                            Item: {
                                "type": "Activity",
                                "id": act_id,
                                "user": req.user.Username,
                                "action": "Added",
                                "item": type,
                                "medium": download_type,
                                "item_name": name,
                                "timestamp": new Date().getTime(),
                                "Date": timestamp(new Date().getTime())
                            }
                        }
                        docClient.put(params, function (err, data) {
                            if (err) {
                                var error = {};
                                error.message = "Error updating Activity";
                                return res.status(400).json(errors);
                            } else {
                                res.json({
                                    "message": "Completed"
                                })


                            }
                        })
                    }
                });

            } else {
                return res.status(400).json({
                    message: "Invalid or broken link"
                })

            }
        });
    } catch (err) {
        return res.status(400).json({
            message: "Server error"
        })
    }
})
//-----------------------------------End of the Route-------------------------------------------------------------------------------------
//Path = /api/upload/category
//Access = Private
//Method = POST
//Desc =  Route to upload new Category
router.post("/api/upload/category", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        const { errors, isValid } = validateCategoryInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        var cat_id = uuid.v4();
        var cat_name = req.body.name;
        var desc = req.body.desc;
        var poster = req.body.location;
        var type = req.body.type;
        var subtitle = req.body.subtitle;
        var params = {

            TableName: keys.Table,
            Item: {
                "type": type,
                "id": cat_id,
                "category_name": cat_name,
                "poster": poster,
                "category_Desc": desc,
                "uploader_id": req.user.id,
                "timestamp": new Date().getTime(),
                "subtitle": subtitle
            }

        }
        docClient.put(params, function (err, data) {
            if (err) {
                var errors = {};
                errors.mesasge = "Error Connecting Database"
                console.log(err);
                return res.status(400).json(errors);
            } else {
                //Add Activity
                var act_id = uuid.v4();
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": act_id,
                        "user": req.user.Username,
                        "action": "Added",
                        "item": type,
                        "item_name": cat_name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())

                    }
                }
                //Update Activity
                docClient.put(params, function (err, data) {
                    if (err) {
                        error.message = "Error updating Activity";
                        return res.status(400).json(errors);
                    } else {
                        var params = {
                            TableName: keys.Table,
                            Key: {
                                "type": "Counters",
                                "id": keys.CounterId
                            },
                            UpdateExpression: " ADD #counter :incva",
                            ExpressionAttributeNames: {
                                "#counter": "CategoryCount"
                            },
                            ExpressionAttributeValues: {
                                ":incva": 1
                            },
                            ReturnValues: "UPDATED_NEW"
                        };
                        docClient.update(params, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.status(400).json({ "message": "Error Updating Counter" })

                            } else {
                                res.json({
                                    "category_id": cat_id
                                })

                            }
                        })


                    }
                })

            }
        })


    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }
    //Validations

})
//---------------------------------------------End of the Route-------------------------------------------------------------------------

//Path = /api/upload/subcategory
//Access = Private
//Method = POST
//Desc = Route to add Sub Category
router.post("/api/upload/subcategory", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        const { errors, isValid } = validateCategoryInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        var cat_id = uuid.v4();
        var cat_name = req.body.name;
        var desc = req.body.desc;
        var poster = req.body.location;
        var type = req.body.type;
        var subtitle = req.body.subtitle;
        if (req.body.parent) { }
        var parent_id = req.body.parent;
        var params = {

            TableName: keys.Table,
            Item: {
                "type": type,
                "id": cat_id,
                "category_name": cat_name,
                "poster": poster,
                "category_Desc": desc,
                "parent_id": parent_id,
                "uploader_id": req.user.id,
                "timestamp": new Date().getTime(),
                "subtitle": subtitle
            }

        }
        docClient.put(params, function (err, data) {
            if (err) {
                var errors = {};
                console.log(err);
                return res.status(400).json(errors);
            } else {
                //Add Activity
                var act_id = uuid.v4();
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": act_id,
                        "user": req.user.Username,
                        "action": "Added",
                        "item": type,
                        "item_name": cat_name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())

                    }
                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        error.message = "Error updating Activity";
                        return res.status(400).json(errors);
                    } else {
                        res.json({
                            "category_id": cat_id
                        })


                    }
                })

            }
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }
    //Validations

})
//---------------------------End of the Route----------------------------------------------------------------------------------------

//Access = Private Route
//Method = POST
//Path = /api/get/:Item
//Desc = This route is used to get all items have same type. For example for getting all books ( /api/get/Book) , Users = (/api/get/User)
router.get("/api/get/:Item", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.Item
            },
            Limit: 20
        };
        if (req.params.Item === "Activity" && !req.user.isAdmin) {
            res.json({ "message": "Unauthorised Access" })

        } else {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    res.json(data.Items)
                }
            }
            )
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});



router.get("/api/get/:Item", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.Item
            },
            Limit: 20
        };
        if (req.params.Item === "Activity" && !req.user.isAdmin) {
            res.json({ "message": "Unauthorised Access" })

        } else {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    res.json(data.Items)
                }
            }
            )
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});



//----------------------------------------------------------------------------------------------------------------


router.get("/api/getActivity", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Activity"
            },
            Limit: 20,
            ScanIndexForward: false
        };
        if (!req.user.isAdmin) {
            res.json({ "message": "Unauthorised Access" })

        } else {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    res.json(data.Items)
                }
            }
            )
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});

//-------------------------------------------------------------------------------------------------------------------------------------


router.get("/api/getBooks", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": "Book"
            },
            Limit: 20,
            ScanIndexForward: false
        };

        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});
//------------------End of the Route----------------------------------------------------------------------------------

//Path = /api/getChild/:type/:parent_id
//Access = Private
//Method - GET
//Desc = These route is used to get all child items having same parent
//Example to get all books of particular subCategory
// the path will be GET(/api/getChild/Book/(Subcategory_id))


router.get("/api/getChild/:type/:parent_id", (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.params.parent_id
            },

        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data.Items)
            }
        }
        )

        //--------------------------------------End of the Route-------------------------------------------------


    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }
});
//Path = /api/getItem/:type/:id
//Access = Private
//Method - GET
//Desc = These route is used to get an specified item by giving its type and id in route 
router.get("/api/getItem/:type/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type and #item_id =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#item_id": "id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.params.id
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {

                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});

//Route to get Book page
router.get("/api/getBookPage/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#item_id =:id",
            ExpressionAttributeNames: {
                "#item_id": "id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.params.id
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {

                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});
//-------------------------------------End of the Route-------------------------------------------------------------------
// Access = Private
// Path = /api/post/item
// Mehod = POST
//Desc = Route to add chapter and solution----------------
//Route to add Chapter and solution
router.post("/api/post/item", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        //Do Validation
        const { errors, isValid } = ValidateChapterInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const url = req.body.url;
        request({
            url: url,
            method: "HEAD"
        }, function (err, response, body) {
            if (!err && response.headers['content-type'] &&
                (response.headers["content-type"] === "application/pdf" || response.headers["content-type"] === "application/octet-stream")) {
                console.log(typeof req.body.index)
                var index = Number(req.body.index);
                console.log(typeof index)
                if (req.body.medium === "DirectLink") {
                    console.log("Updating");
                    GraphicalCounters.updateTotalFileUploads(req, res, 1)
                }
                let Ctype
                if (req.body.type === "Chapter") {
                    Ctype = "chapters"
                } else if (req.body.type === "Solution") {
                    Ctype = "solutions"
                }
                var params = {

                    TableName: keys.Table,
                    Item: {
                        "type": req.body.type,
                        "id": uuid.v4(),
                        "index": index,
                        "num_index": index,
                        "chapter_name": req.body.name,
                        "uploader_id": req.user.id,
                        "User": req.user.Username,
                        "parent_id": req.body.id,
                        "url": req.body.url,
                        "timestamp": new Date().getTime()
                    }

                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ "message": "Database Error" })
                    } else {

                        var date = new Date();
                        var act_id = uuid.v4();
                        var params = {
                            TableName: keys.Table,
                            Item: {
                                "type": "Activity",
                                "id": act_id,
                                "user": req.user.Username,
                                "action": "Added",
                                "item": req.body.type,
                                "item_name": req.body.name,
                                "timestamp": new Date().getTime(),
                                "Date": timestamp(new Date().getTime())

                            }
                        }
                        docClient.put(params, async function (err, data) {
                            if (err) {
                                var error = {};
                                error.message = "Error updating Activity";
                                return res.status(400).json(errors);
                            } else {
                                var flag = await GraphicalCounters.increaseitemcount(1, Ctype, req.body.Btype, req.body.id);
                                if (flag) {
                                    res.json({
                                        "message": "Completed"
                                    })
                                } else {
                                    res.status(400).json({
                                        "message": "Not Updated counter"
                                    })
                                }



                            }
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Invalid or broken link"
                })
            }
        });
    } catch (err) {
        return res.status(400).json({
            message: "Server error"
        })
    }
})

//Access = Private
//path = /api/getOwned/:type
//Method = GET
//Desc = Route to get items of particular user
router.get("/api/getOwned/:type", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "owner-index",
            KeyConditionExpression: "#type = :Item_type and #uid =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#uid": "uploader_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.user.id
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                res.status(400).json({ "message": "Network of Database error" })
            } else {

                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});

//Access = Private
//Method  = GET
//path = /api/edit/book
//Desc = Route to edit book

router.put("/api/edit/book", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        var id = req.body.id;
        var book_name = req.body.name;
        var author = req.body.author;
        var description = req.body.desc;
        var subcategory_id = req.body.subcategory_id;
        var type = req.body.type;
        var act_id = uuid.v4();
        var lang = req.body.language;
        var subcategory = req.body.subcategory
        var params = {
            TableName: keys.Table,
            Key: {
                "type": type,
                "id": id
            },
            ExpressionAttributeNames: {
                "#name": "book_name",
                "#auth": "author",
                "#desc": "description",
                "#update": "Updated",
                "#editedBy": "EditedBy",
                "#parent": "parent_id",
                "#lang": "lang",
                "#sub": "subcategory"
            },
            ExpressionAttributeValues: {
                ":n": book_name,
                ":a": author,
                ":d": description,
                ":p": subcategory_id,
                ":up": new Date().getTime(),
                ":e": req.user.Username,
                ":lang": lang,
                ":sub": subcategory


            },
            ReturnValues: "UPDATED_NEW"
        }
        if (req.body.tags) {
            var tags = req.body.tags.split(",")
            params.UpdateExpression = "set #name = :n , #auth = :a ,#desc = :d ,#sub = :sub ,  #parent = :p, #update = :up , #editedBy = :e , #lang = :lang , #tags = :tags";
            params.ExpressionAttributeValues[":tags"] = tags;
            params.ExpressionAttributeNames["#tags"] = "tags"
        } else {
            params.UpdateExpression = "set #name = :n , #auth = :a ,#desc = :d ,#sub = :sub , #parent = :p, #update = :up , #editedBy = :e , #lang = :lang ";
        }
        docClient.update(params, function (err, data) {
            if (err) {
                res.status(400).json({ "message": "Network error or database error" })
                console.log(err);
            } else {
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": act_id,
                        "user": req.user.Username,
                        "action": "Edited",
                        "item": type,
                        "item_name": book_name,
                        "status": req.body.status,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }
                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        res.status(400).json({ "message": "Network or Database error" })
                        console.log(err);
                    } else {
                        res.json({ "message": "Updated the Book" })
                    }
                })


            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }



})
//----------------------------------------------------End of the Route--------------------------------------------------------
//Access = Private
//Method = PUT
//Desc = Route to edit poster (not for Category and subcategory)
router.put("/api/edit/poster", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var id = req.body.id;
        var poster = req.body.url;
        var type = req.body.type;
        var name = req.body.name
        var params = {
            TableName: keys.Table,
            Key: {
                "type": type,
                "id": id
            },
            UpdateExpression: "set #post = :p",
            ExpressionAttributeNames: {
                "#post": "poster"

            },
            ExpressionAttributeValues: {
                ":p": poster

            },
            ReturnValues: "UPDATED_NEW"
        }

        docClient.update(params, function (err, data) {
            if (err) {
                res.status(400).json({ "message": "Network or Database error" })
                console.log(err);
            } else {
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": uuid.v4(),
                        "user": req.user.Username,
                        "action": "Updated",
                        "item": "Poster",
                        "item_name": name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }
                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        res.status(400).json({ "message": "Network or Database error" })
                        console.log(err);
                    } else {
                        res.json({ "message": "Updated the Book" })
                    }
                })

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})
//----------------------------------------------------End of the Route------------------------------------------
//Access = Private
//Method = PUT
//Desc = Route to edit Chapter and Solutuion of the book
//Edit Chapter or solution of the book
router.put("/api/edit/item", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var url = req.body.url
        if (url.includes('1drv.ms')) {
            url = url.replace('1drv.ms', '1drv.ws');
        }

        request({
            url: url,
            method: "HEAD"
        }, function (err, response, body) {
            if (!err && response.headers['content-type'] &&
                (response.headers["content-type"] === "application/pdf" || response.headers["content-type"] === "application/octet-stream")) {
                var type = req.body.type;
                var index = Number(req.body.index);
                var num_index = Number(req.body.index)
                var name = req.body.name;
                var id = req.body.id;
                var url = req.body.url
                var medium = req.body.medium
                var params = {
                    TableName: keys.Table,
                    Key: {
                        "id": id,
                        "type": type
                    },
                    UpdateExpression: "set #u = :link , #ind =:i , #name = :n , #med = :dtype ,#num = :num ",
                    ExpressionAttributeNames: {
                        "#u": "url",
                        "#ind": "index",
                        "#name": "chapter_name",
                        "#med": "medium",
                        "#num": "num_index"

                    },
                    ExpressionAttributeValues: {
                        ":link": url,
                        ":i": index,
                        ":n": name,
                        ":dtype": medium,
                        ":num": num_index
                    },
                    ReturnValues: "UPDATED_NEW"
                }

                docClient.update(params, (err, data) => {
                    if (err) {
                        res.status(400).json({ "message": "Network or Database error" })
                        console.log(err);
                    } else {

                        // Add Activity
                        var params = {
                            TableName: keys.Table,
                            Item: {
                                "type": "Activity",
                                "id": uuid.v4(),
                                "user": req.user.Username,
                                "action": "Edited",
                                "item": type,
                                "item_name": name,
                                "timestamp": new Date().getTime(),
                                "Date": timestamp(new Date().getTime())
                            }

                        }
                        docClient.put(params, function (err, data) {
                            if (err) {
                                res.status(400).json({ "message": "Network or Database error" })
                                console.log(err);
                            } else {
                                var params = {
                                    TableName: keys.Table,
                                    KeyConditionExpression: "#type = :Item_type and #item_id =:id",
                                    ExpressionAttributeNames: {
                                        "#type": "type",
                                        "#item_id": "id"
                                    },
                                    ExpressionAttributeValues: {
                                        ":Item_type": type,
                                        ":id": id
                                    }
                                };
                                docClient.query(params, function (err, data) {
                                    if (err) {
                                        console.error(err);
                                        res.status(400).json({ "message": "Database or Network Error" })
                                    } else {
                                        var parent = data.Items[0].parent_id;
                                        res.json({ "id": parent })
                                    }
                                })
                            }
                        })

                    }
                })



            } else {
                return res.status(400).json({
                    message: "Invalid or broken link"
                })
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or broken Link"
        })
    }
})
//-----------------------------------------------------------End of the Route-------------------------------------
//Access = Private
//Method = PUT
//Desc = Route to edit Category
router.put("/api/edit/category", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        var id = req.body.id;
        var name = req.body.name;
        var desc = req.body.desc;
        var subtitle = req.body.subtitle
        var params = {
            TableName: keys.Table,
            Key: {
                "id": id,
                "type": "Category"
            },
            UpdateExpression: "set #n = :name , #desc =:description , #sub = :subtitle",
            ExpressionAttributeNames: {
                "#n": "category_name",
                "#desc": "category_Desc",
                "#sub": "subtitle"
            },
            ExpressionAttributeValues: {
                ":name": name,
                ":description": desc,
                ":subtitle": subtitle
            },
            ReturnValues: "UPDATED_NEW"
        }
        docClient.update(params, function (err, data) {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "Network Error or Database error" })
            } else {
                //Add Activity
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": uuid.v4(),
                        "user": req.user.Username,
                        "action": "Edited",
                        "item": "Category",
                        "item_name": name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }

                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ "message": "Network or Database error" })
                    } else {
                        res.json({ "message": "Edited category" })
                    }
                })

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }
})
//---------------------------------------------End of the Route--------------------------------------------------------------
//Access = Private
//Method = GET
//Desc = Route to edit poster of category or subcategory
router.put("/api/edit/Categoryposter", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var id = req.body.id;
        var type = req.body.type;
        var url = req.body.url;
        var name = req.body.name
        var params = {
            TableName: keys.Table,
            Key: {
                "id": id,
                "type": type
            },
            UpdateExpression: "set #post = :link ",
            ExpressionAttributeNames: {
                "#post": "poster",
            },
            ExpressionAttributeValues: {
                ":link": url,
            },
            ReturnValues: "UPDATED_NEW"
        }
        docClient.update(params, function (err, data) {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "Network Error or Database error" })
            } else {
                //Add Activity
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": uuid.v4(),
                        "user": req.user.Username,
                        "action": "Edited",
                        "item": "Poster",
                        "item_name": name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }

                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ "message": "Network or Database error" })
                    } else {
                        res.json({ "message": "Edited Poster" })
                    }
                })

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }
})
//------------------------------------------------------End of the Route-------------------------------------------------
//Access = Private
//Method =PUT
//Desc = Route to edit Sub Category
router.put("/api/edit/subcategory", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var id = req.body.id;
        var name = req.body.name;
        var desc = req.body.desc;
        var subtitle = req.body.subtitle
        var params = {
            TableName: keys.Table,
            Key: {
                "id": id,
                "type": "Sub Category"
            },
            UpdateExpression: "set #n = :name , #desc =:description ,#par =:p ,  #sub = :subtitle",
            ExpressionAttributeNames: {
                "#n": "category_name",
                "#desc": "category_Desc",
                "#par": "parent_id",
                "#sub": "subtitle"
            },
            ExpressionAttributeValues: {
                ":name": name,
                ":description": desc,
                ":p": req.body.parent,
                ":subtitle": req.body.subtitle
            },
            ReturnValues: "UPDATED_NEW"
        }
        docClient.update(params, function (err, data) {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "Network Error or Database error" })
            } else {
                //Add Activity
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": uuid.v4(),
                        "user": req.user.Username,
                        "action": "Edited",
                        "item": "Sub Category",
                        "item_name": name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }

                }
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ "message": "Network or Database error" })
                    } else {
                        res.json({ "message": "Edited category" })
                    }
                })

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }



})
//-------------------------------------End of the Route-------------------------------------------------------------------------------
//Access = Private
//Method = GET
//Desc =To get all the Counters for total Users, books and Categories

router.get("/api/get/dyno/stats", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#typ = :c",
            ExpressionAttributeNames: {
                "#typ": "type",
            },
            ExpressionAttributeValues: {
                ":c": "Counters"
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {

                data.Items[0].timestamp = new Date().getTime();
                data.Items[0].Date = timestamp;
                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }


})


//Path = /api/getChild/:type/:parent_id
//Access = Private
//Method - GET
//Desc = These route is used to get all child items having same parent
//Example to get all books of particular subCategory
// the path will be GET(/api/getChild/Book/(Subcategory_id))
router.post("/api/getChild/Key/:type/:parent_id", (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.params.parent_id
            },
            ProjectionExpression: 'id , #type , book_name , poster',
            Limit: 12
        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        console.log(params.ExclusiveStartKey);
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});

//-----------------------------------------------Route for sub Category ---------------------------------------------------------
router.post("/api/getSubChild/Key/:type/:parent_id", (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.params.parent_id
            },
            ProjectionExpression: 'id , category_Desc , poster ,category_name',
        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        console.log(params);
        console.log(params.ExclusiveStartKey);
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data);
                console.log(data);
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }


});
//--------------------------------Same route just to get 4 books--------------
router.get("/api/getChild/Keylimit/Book/:parent_id", (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Book",
                ":id": req.params.parent_id
            },
            ProjectionExpression: 'id ,#type ,  book_name , poster',
            Limit: 4
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data.Items)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});






//-------------------------------------------------------------------------------------------------------------------

router.post("/api/getOwned/key/:type", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "owner-index",
            KeyConditionExpression: "#type = :Item_type and #uid =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#uid": "uploader_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": req.params.type,
                ":id": req.user.id
            },
            ProjectionExpression: 'id , book_name , #type, poster',
            Limit: 12

        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                res.status(400).json({ "message": "Network of Database error" })
            } else {

                res.json(data);
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});
//----------------Get paginated Categories----------------------------------------------------------------------------------------------------------------

router.post("/api/getCategories", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Category"
            },
        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }


})


//--------------------------------------Delete Routes-----------------------------------------------------------------------------------------

router.delete("/api/delete/:type/:id/:name/:booktype/:bookid", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = req.params.type;
        console.log(req.params.type)
        var id = req.params.id;
        let Ctype;
        if (type === "Chapter") {
            Ctype = "chapters"
        } else if (type === "Solution") {
            Ctype = "solutions"
        }
        var bookid = req.params.bookid;
        var booktype = req.params.booktype
        var name = req.params.name
        var params = {
            TableName: keys.Table,
            Key: {
                "type": type,
                "id": id
            }
        };
        docClient.delete(params, (err, data) => {
            if (err) {
                console.log(err);
                res.status(400).json({ "Message": "Failed to delete" })
            } else {
                //Add Activity
                var params = {
                    TableName: keys.Table,
                    Item: {
                        "type": "Activity",
                        "id": uuid.v4(),
                        "user": req.user.Username,
                        "action": "Deleted",
                        "item": type,
                        "item_name": name,
                        "timestamp": new Date().getTime(),
                        "Date": timestamp(new Date().getTime())
                    }

                }
                docClient.put(params, async function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ "message": "Network or Database error" })
                    } else {
                        var value = -1
                        var flag = await GraphicalCounters.increaseitemcount(value, Ctype, booktype, bookid)
                        if (flag) {
                            res.json({ "message": "Item deleted" })
                        } else {
                            res.status(400).json({ "message": "Item deleted" })
                        }

                    }
                })

            }

        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})
router.get("/api/getAllCategories", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Category"
            },
            ProjectionExpression: 'id , category_name '
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data.Items)

            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})
router.get("/api/getAllSubCategories/:parent_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Sub Category",
                ":id": req.params.parent_id
            },
            ProjectionExpression: 'id , category_name',
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data.Items);
            }
        }
        )
    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});



router.post("/api/getMyBook/Sub/:type/:parent_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            KeyConditionExpression: "#type = :Item_type and #parent =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#parent": "parent_id"
            },
            FilterExpression: 'uploader_id= :uid',
            ExpressionAttributeValues: {
                ":Item_type": "Book",
                ":id": req.params.parent_id,
                ":uid": req.user.id
            },
            ProjectionExpression: 'id , #type , book_name , poster',
            Limit: 12
        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        console.log(params.ExclusiveStartKey);
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});


// Route to filter my books according to category
router.post("/api/getMyBook/cat/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var id = req.params.id;

        var params = {
            TableName: keys.Table,
            IndexName: "owner-index",
            KeyConditionExpression: "#type = :Item_type and #uid =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#uid": "uploader_id",
                "#Cat_id": "Category_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Book",
                ":id": req.user.id,
                ":cid": id
            },
            FilterExpression: "#Cat_id = :cid",
            ProjectionExpression: 'id ,#type , book_name , poster',
            Limit: 12

        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                res.status(400).json({ "message": "Network of Database error" })
            } else {
                res.json(data)
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});



// Route to filter my books according to Sub category
router.post("/api/getMyBook/sub/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var id = req.params.id;


        var params = {
            TableName: keys.Table,
            IndexName: "owner-index",
            KeyConditionExpression: "#type = :Item_type and #uid =:id",
            ExpressionAttributeNames: {
                "#type": "type",
                "#uid": "uploader_id",
                "#Cat_id": "parent_id"
            },
            ExpressionAttributeValues: {
                ":Item_type": "Book",
                ":id": req.user.id,
                ":cid": id
            },
            FilterExpression: "#Cat_id = :cid",
            ProjectionExpression: 'id , #type, book_name , poster',
            Limit: 12

        };
        if (req.body.LastEvaluatedKey.id) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                res.status(400).json({ "message": "Network of Database error" })
            } else {

                res.json(data);
            }
        }
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

});

//------------------------------------------------Upload bulk chapter and solution-----------------------------------------------------------
router.post("/api/upload/Bulk/items", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var urlArray = [];
        let Ctype;
        var type = req.body.type;
        if (type === "Chapter") {
            Ctype = "chapters"
        } else if (type === "Solution") {
            Ctype = "solutions"
        }
        var BookType = req.body.Btype
        var parent_id = req.body.id;
        var id = uuid.v4();
        var time = new Date().getTime();
        var chapters = req.body.Chapters;
        const table = keys.Table;
        var name = req.body.name;
        console.log(name);
        //Do Validation
        const { errors, isValid } = ValidateBulkInput(chapters);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        chapters.map((chapter) => {

            chapter.id = uuid.v4();
            chapter.type = type;
            chapter.parent_id = parent_id;
            chapter.timestamp = time;
            chapter.index = Number(chapter.index);
            chapter.num_index = Number(chapter.index);
            urlArray.push({
                url: chapter.url,
                index: Number(chapter.index)
            })
        })


        const sendGroupData = async (dataArray) => {
            const table = keys.Table;
            const packetSize = 25;
            console.log(table);
            const count = dataArray.length
            console.log(dataArray);
            const dataPackets = [];
            while (dataArray.length !== 0) {
                dataPackets.push(dataArray.splice(0, packetSize));
            }

            return new Promise(((resolve, reject) => {
                let submissionsComplete = 0;
                let submissionsToComplete = dataPackets.length;


                dataPackets.forEach(async (currentDataPacket/*,index*/) => {
                    const params = { RequestItems: {} };
                    params["RequestItems"][table] = [];
                    currentDataPacket.forEach((data) => {
                        if ('url' in data && data.url && data.url.includes('1drv.ms')) {
                            data['url'] = data.url.replace('1drv.ms', '1drv.ws');
                        }


                        params['RequestItems'][table].push({ PutRequest: { Item: data } })
                    });


                    docClient.batchWrite(params, function (err, data) {
                        if (err) {
                            res.status(400).json({ "Error": "Error uploading bulk data" });
                        } else {
                            submissionsComplete++;
                            if (submissionsComplete === submissionsToComplete) {
                                GraphicalCounters.updateTotalFileUploads(req, res, count);
                                GraphicalCounters.increaseitemcount(count, Ctype, BookType, parent_id);
                                resolve({ isDataSent: true });
                                console.log(name);
                                var params = {
                                    TableName: keys.Table,
                                    Item: {
                                        "type": "Activity",
                                        "id": uuid.v4(),
                                        "user": req.user.Username,
                                        "action": "Bulk uploaded",
                                        "item": type,
                                        "item_name": name,
                                        "timestamp": new Date().getTime(),
                                        "Date": timestamp(new Date().getTime())
                                    }

                                }
                                docClient.put(params, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        res.status(400).json({ "message": "Network or Database error" })
                                    } else {
                                        res.json({ "message": "Bulk Uploded" })
                                    }
                                })
                            }
                        }
                    });
                });
            }));

        };

        const ValidateLink = async (dataArray) => {

            return new Promise(((resolve, reject) => {
                let LinkVerifictcationComplete = 0;
                let Linkstoverify = dataArray.length;
                console.log(Linkstoverify);
                dataArray.forEach(async (current, ind) => {
                    console.log(ind);
                    console.log(current)
                    request({
                        url: current.url,
                        method: "HEAD"
                    }, function (err, response, body) {
                        if (!err && response.headers['content-type'] &&
                            (response.headers["content-type"] === "application/pdf" || response.headers["content-type"] === "application/octet-stream")) {
                            LinkVerifictcationComplete++
                            console.log("Verified Links " + LinkVerifictcationComplete)
                            if (LinkVerifictcationComplete === Linkstoverify) {
                                resolve({ linkVerify: true })
                                sendGroupData(chapters);
                            }
                        } else {
                            res.status(400).json({
                                message: "Invalid link of index " + current.index
                            })
                        }
                    });
                });
            }));

        };
        ValidateLink(urlArray)
    } catch (err) {
        res.status(400).json({
            message: "server error"
        })
    }
})
//------------------------------------------Getting File info from Link route--------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------
router.delete("/api/deleteBook/:id/:name/:type", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        console.log("Reached")
        var id = req.params.id;
        var name = req.params.name;
        var Chapter = "Chapter";
        var Solution = "Solution";
        var Book = req.params.type; //req.body.type
        var Deletedata = [];
        let uploader_id;
        //Get all chapters
        var params = {
            TableName: keys.Table,
            IndexName: "parent_child-index",
            ProjectionExpression: "#uid , #type",
            KeyConditionExpression: "#type = :type and #id =:parent",
            ExpressionAttributeNames: {
                "#id": "parent_id",
                "#type": "type",
                "#uid": "id"
            },
            ExpressionAttributeValues: {
                ":parent": id,
                ":type": Chapter
            },
        };

        docClient.query(params, (err, data) => {
            if (err) {
                console.log(err)
                res.status(400).json({ "message": "Network or database error" })
            } else {
                data.Items.map((chapters) => {
                    Deletedata.push(chapters)
                })
                //Fetch all Solutions
                var params = {
                    TableName: keys.Table,
                    IndexName: "parent_child-index",
                    ProjectionExpression: "#uid , #type",
                    KeyConditionExpression: "#type = :type and #id =:parent",
                    ExpressionAttributeNames: {
                        "#id": "parent_id",
                        "#type": "type",
                        "#uid": "id"
                    },
                    ExpressionAttributeValues: {
                        ":parent": id,
                        ":type": Solution
                    },
                };
                docClient.query(params, (err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(400).json({ "message": "Network or database error" })
                    } else {
                        data.Items.map((solutions) => {
                            Deletedata.push(solutions)
                        })
                        //Fetch the Parent Book
                        var params = {
                            TableName: keys.Table,
                            ProjectionExpression: "#uid , #type , #uploader ",
                            KeyConditionExpression: "#type = :type and #uid =:parent",
                            ExpressionAttributeNames: {
                                "#type": "type",
                                "#uid": "id",
                                "#uploader": "uploader_id"
                            },
                            ExpressionAttributeValues: {
                                ":parent": id,
                                ":type": Book
                            },
                        };
                        docClient.query(params, (err, data) => {
                            if (err) {
                                console.log(err)
                                res.status(400).json({ "message": "Network or database error" })
                            } else {
                                console.log(data);
                                data.Items.map((book) => {
                                    uploader_id = book.uploader_id;
                                    console.log(uploader_id)
                                    delete book.uploader_id
                                    Deletedata.push(book)
                                })
                                const DeleteBook = async (dataArray, uploader_id) => {
                                    const table = keys.Table;
                                    const packetSize = 25;
                                    console.log(table);
                                    console.log(dataArray);
                                    const dataPackets = [];
                                    while (dataArray.length !== 0) {
                                        dataPackets.push(dataArray.splice(0, packetSize));
                                    }

                                    return new Promise(((resolve, reject) => {
                                        let submissionsComplete = 0;
                                        let submissionsToComplete = dataPackets.length;


                                        dataPackets.forEach(async (currentDataPacket/*,index*/) => {
                                            const params = { RequestItems: {} };
                                            params["RequestItems"][table] = [];
                                            currentDataPacket.forEach((data) => {
                                                params['RequestItems'][table].push({ DeleteRequest: { Key: data } })
                                            });

                                            docClient.batchWrite(params, function (err, data) {
                                                if (err) {
                                                    res.status(400).json({ "Error": "Error uploading bulk data" });
                                                    console.log(err)
                                                } else {

                                                    console.log("here")
                                                    submissionsComplete++;
                                                    if (submissionsComplete === submissionsToComplete) {
                                                        resolve({ isDataSent: true });
                                                        var params = {
                                                            TableName: keys.Table,
                                                            Item: {
                                                                "type": "Activity",
                                                                "id": uuid.v4(),
                                                                "user": req.user.Username,
                                                                "action": "Deleted",
                                                                "item": Book,
                                                                "item_name": name,
                                                                "timestamp": new Date().getTime(),
                                                                "Date": timestamp(new Date().getTime())
                                                            }

                                                        }
                                                        docClient.put(params, function (err, data) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(400).json({ "message": "Network or Database error" })
                                                            } else {
                                                                //Decrement Book Counter
                                                                var params = {
                                                                    TableName: keys.Table,
                                                                    Key: {
                                                                        "type": "Counters",
                                                                        "id": keys.CounterId
                                                                    },
                                                                    UpdateExpression: "SET #counter  = #counter - :incva",
                                                                    ExpressionAttributeNames: {
                                                                        "#counter": "BookCount"
                                                                    },
                                                                    ExpressionAttributeValues: {
                                                                        ":incva": 1
                                                                    },
                                                                    ReturnValues: "UPDATED_NEW"
                                                                };
                                                                docClient.update(params, (err, data) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        res.status(400).json({ "message": "Network or Database error" })
                                                                    } else {
                                                                        console.log(uploader_id)
                                                                        var id = uploader_id;
                                                                        var type = "User"
                                                                        //update the user uploads
                                                                        var params = {
                                                                            TableName: keys.Table,
                                                                            Key: {
                                                                                "type": type,
                                                                                "id": id,
                                                                            },
                                                                            UpdateExpression: "set #uploads = #uploads + :value",
                                                                            ExpressionAttributeNames: {
                                                                                "#uploads": "uploads"
                                                                            },
                                                                            ExpressionAttributeValues: {
                                                                                ":value": -1
                                                                            },
                                                                            ReturnValues: "UPDATED_NEW"
                                                                        }
                                                                        docClient.update(params, async (err, data) => {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                console.log("Error Updating User uploads of id : " + id)
                                                                            } else {
                                                                                console.log("Updated User uploads " + id)
                                                                                var item = {}
                                                                                item.message = "Deleted Book";
                                                                                console.log("Reached here");
                                                                                var flag1 = await GraphicalCounters.updateUserMonthlyBooks(-1, uploader_id)
                                                                                var flag2 = await GraphicalCounters.updateUserWeeklyBooks(-1, uploader_id)
                                                                                if (flag1 && flag2) {
                                                                                    GraphicalCounters.UpdateMonthlyBookCounter(req, res, -1, item)
                                                                                } else {
                                                                                    res.status(400).json({
                                                                                        message: "Error updating counters"
                                                                                    })
                                                                                }

                                                                            }
                                                                        })

                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }


                                                }
                                            });
                                        });
                                    }));

                                };
                                DeleteBook(Deletedata, uploader_id);

                            }
                        })

                    }
                })
            }
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})

//Route for getting paginated Activities in table
//Private Route
router.post("/api/tableActivities", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Activity"
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            Limit: 11,
            ScanIndexForward: false
        };
        if (req.body.LastEvaluatedKey && req.body.LastEvaluatedKey.type) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)
            }
        })


    } catch (err) {
        console.log(err);
        return res.status(400).json({ "message": "Server error" })
    }
})



//Route for getting paginated Books in table
//Private Route
router.post("/api/tableBooks", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Book"
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            Limit: 11,
            ScanIndexForward: false
        };
        if (req.body.LastEvaluatedKey && req.body.LastEvaluatedKey.type) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)
            }
        })


    } catch (err) {
        console.log(err);
        return res.status(400).json({ "message": "Server error" })
    }
})


//Route for getting paginated Archived Books in Archive section
//Private Route
router.post("/api/ArchivedBooks", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "A_Book"
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            Limit: 11,
            ScanIndexForward: false
        };
        if (req.body.LastEvaluatedKey && req.body.LastEvaluatedKey.type) {
            params.ExclusiveStartKey = req.body.LastEvaluatedKey;
        }
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                res.json(data)
            }
        })


    } catch (err) {
        console.log(err);
        return res.status(400).json({ "message": "Server error" })
    }
})


router.put("/api/archiveSwitch", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var data = req.body.data
        var type = data.type;
        var id = data.id
        var name = data.book_name
        var action = "";
        let NewType;
        delete data.tableData;
        if (data.type === "A_Book") {
            data.type = "Book"
            NewType = data.type
            action = "Published"
        } else if (data.type === "Book") {
            data.type = "A_Book"
            action = "Archived"
            NewType = data.type
        }


        console.log(data)

        var params = {

            TableName: keys.Table,
            Item: data

        }
        console.log(params);
        docClient.put(params, function (err, data) {
            if (err) {

                console.log(err)
                return res.status(400).json({
                    message: "Network or database error"
                })

            } else {
                //Delete from from Public
                var params = {
                    TableName: keys.Table,
                    Key: {
                        "type": type,
                        "id": id
                    }
                };
                console.log(params);
                docClient.delete(params, (err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(400).json({
                            message: "Book is not removed from public"
                        })

                    } else {
                        //Add Activity
                        var params = {
                            TableName: keys.Table,
                            Item: {
                                "type": "Activity",
                                "id": uuid.v4(),
                                "user": req.user.Username,
                                "action": action,
                                "item": "Book",
                                "item_name": name,
                                "timestamp": new Date().getTime(),
                                "Date": timestamp(new Date().getTime())
                            }

                        }
                        docClient.put(params, function (err, data) {
                            if (err) {
                                return res.status(400).json({
                                    message: "Book Action completed but failed to add activity"
                                })

                            } else {
                                if (NewType === "Book") {
                                    GraphicalCounters.UpdateMonthlyBookCounter(req, res, 1, NewType)
                                } else if (NewType === "A_Book") {
                                    GraphicalCounters.UpdateMonthlyBookCounter(req, res, -1, NewType)
                                }
                            }
                        })


                    }
                })

            }
        })


    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})

//Search Book 
router.get("/api/Search/:query/:page/:limit", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var query = req.params.query;
        var page = req.params.page;
        var limit = req.params.limit;
        var url = ""
        if (query && page && limit) {
            url = keys.SearchUrl + "?query=" + query + "&page=" + page + "&limit=" + limit
        } else {
            return res.status(400).json({
                message: "Incomplete query parameters"
            })
        }

        request({
            url: url,
            method: "GET"
        }, function (err, response, body) {
            if (err) {
                console.log(err);
                res.status(400).json({
                    message: "Server or network error"
                })
            } else {
                console.log(body)
                res.send(body)
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }


})


//get Monthly book count
router.get("/api/getMonthly/bookCount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Monthly_Book_Counter";
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})



//get Monthly User Count
router.get("/api/getMonthly/userCount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Monthly_User_Counter";
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})

//get Monthly book count
router.get("/api/useruploads", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        console.log("Reached");
        var type = "User";
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
                "#Username": "Username",
                "#uploads": "uploads"
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ProjectionExpression: "#Username , #uploads",
        };
        docClient.query(params, (err, data) => {
            if (err) {
                console.log(err);
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.Username);
                })
                data.Items.map(data => {
                    yaxis.push(data.uploads);
                })
                console.log(xaxis);
                console.log(yaxis);
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }


})


//get Monthly Files Upload
router.get("/api/getMonthly/userCount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Monthly_User_Counter";
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})


//Route to get monthly files uploaded in Cms
router.get("/api/getMonthly/FileCount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var type = "Monthly_File_Counter";
        console.log(req.user);
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})



//Route to get monthly books added
router.get("/api/getWeekly/bookcount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var monthName = new Date().toLocaleString('default', { month: 'long' });
        var year = new Date().getFullYear();
        var type = `${monthName}_${year}_Weekly_Counter`
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})


//Route to get weekly files
router.get("/api/getWeekly/FileCount", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var monthName = new Date().toLocaleString('default', { month: 'long' });
        var year = new Date().getFullYear();
        var type = `${monthName}_${year}_File_Weekly_Counter`
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            IndexName: "type-timestamp-index",
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
            ScanIndexForward: true
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.xpoint);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})



//Route to get monthly books uploaded by user
router.get("/api/getUserMonthly/book/:month/:year", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var month = req.params.month;
        var year = req.params.year;
        var type = `Monthly_Book_${month}_${year}`
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.username);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})


//Route to get monthly files uploaded by user
router.get("/api/getUserMonthly/file/:month/:year", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var month = req.params.month;
        var year = req.params.year;
        var type = `Monthly_File_${month}_${year}`
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.username);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Server error"
        })
    }

})


//Route to get weekly files uploaded by user
router.get("/api/getUserWeekly/file/:week/:month/:year", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var month = req.params.month;
        var year = req.params.year;
        var week = req.params.week;
        var type = `Weekly_File_${week}_${month}_${year}`
        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
        };
        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.username);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})



//Route to get weekly books uploaded by user
router.get("/api/getUserWeekly/book/:week/:month/:year", passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        var month = req.params.month;
        var year = req.params.year;
        var week = req.params.week;
        var type = `Weekly_Book_${week}_${month}_${year}`

        let xaxis = [];
        let yaxis = []
        var params = {
            TableName: keys.Table,
            KeyConditionExpression: "#type = :Item_type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":Item_type": type
            },
        };

        docClient.query(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Error Fetching data"
                })
            } else {
                data.Items.map(data => {
                    xaxis.push(data.username);
                })
                data.Items.map(data => {
                    yaxis.push(data.count);
                })
                console.log(data.Items)
                res.json({
                    x: xaxis,
                    y: yaxis
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            mesasge: "Internal Server error"
        })
    }

})










//------------------------------------------------------End of all Routes related to Book CMS-----------------------------------------------------
module.exports = router;
