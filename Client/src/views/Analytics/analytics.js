
import React, { useState, useEffect } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import CategoryCard from "components/Card/CategoryCard.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import propTypes from "prop-types";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { NavLink } from "react-router-dom";
//Icons
import LibraryBooksSharpIcon from "@material-ui/icons/LibraryBooksSharp";
import CategorySharpIcon from "@material-ui/icons/CategorySharp";
import GroupSharpIcon from "@material-ui/icons/GroupSharp";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
//Style
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { connect } from "react-redux";
import {Getstats ,  GetMonthlyBookCount ,  GetUserUploads , GetMonthlyFileCount , GetWeeklyBookCount , GetWeeklyFileCount , GetUserWeeklyFileUploads , GetUserMonthlybookUploads , GetUserMonthlyFileUploads , GetUserWeeklyBookUploads} from "../../actions/Books.js"
import LinearProgress from '@material-ui/core/LinearProgress';
//Graph library
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel"
const  Dashboard = (props) =>{
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [usercount , setUsercount] = React.useState(0);
  const [categorycount , setCategorycount] = React.useState(0);
  const [bookcount , setBookcount] = React.useState(0);
  const [time , setTime] = React.useState(0);
  const [files , setFileCount] = React.useState(0)
  //radio iput
  const [value , setValue] = React.useState("Month");
 const [filegraphtype , setFilegraphtype] = React.useState("Month")

  //Points for monthly book count graph
  const [data , setData] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
 const [publishedbooks , setPublishedBooks] = React.useState([]);
  
  //Points for monthly files count graph
  const [filedata , setFileData] = React.useState([]);
  const [filecategories, setFileCategories] = React.useState([]);


  //Points for User uploads
  const [uploaddata , setUploaddata] = React.useState([]);
  const [uploadcategories, setUploadcategories] = React.useState([]);

 //points for User monthly book uploads
 const [umbdata , setUmbdata] = React.useState([]);
 const [umbcategories , setUmbcategories] = React.useState([]);

//points for User weekly book uploads
 const [uwbdata , setUwbdata] = React.useState([]);
 const [uwbcategories , setUwbcategories] = React.useState([]);

//points for User monthly files uploads
const [umfdata , setUmfdata] = React.useState([]);
const [umfcategories , setUmfcategories] = React.useState([]);

//points for User monthly files uploads
const [uwfdata , setUwfdata] = React.useState([]);
const [uwfcategories , setUwfcategories] = React.useState([]);

const [bweek , setBweek] = React.useState([]);
const [fweek , setFweek ] = React.useState([]);


  const [start , setStart] = React.useState({
    year: 2020,
    month : "may",
    monthnum: 1
})

const [today , setToday] = React.useState({
   month: new Date().toLocaleString('default', { month: 'short' }),
   year: new Date().getFullYear(),
   monthnum : new Date().getMonth() + 1,
   week: getWeekOfMonth()
   
})

//Validity till 2025
function getWeekOfMonth() {
  var date = new Date();
  const startWeekDayIndex = 1; // 1 MonthDay 0 Sundays
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDay = firstDate.getDay();

  let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
  if (startWeekDayIndex === 1) {
    if (date.getDay() === 0 && date.getDate() > 1) {
      weekNumber -= 1;
    }

    if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
      weekNumber += 1;
    }
  }
  return weekNumber;
}



//Set months of different graph
const [u_m_b_month , setUMBMonth] = React.useState([]);
const [u_m_f_month , setUMFMonth] = React.useState([]);

//Set year of different graph
const [u_m_b_year , setUMBYear] = React.useState([]);
const [u_m_f_year , setUMFYear] = React.useState([]);

const [show_months_books , setSMB] = React.useState([]);
const [show_months_files , setSMF] = React.useState([]);

const [show_years_books , setSYB] = React.useState([]);
const [show_years_files , setSYF] = React.useState([]);


const selectUserBookMonths = (Year) => {
  console.log("Reached here")
  console.log(Year)
  const months = [
    {name : "January" , value: 1},
    {name : "February" , value: 2},
    {name : "March" , value: 3},
    {name : "April" , value: 4},
    {name : "May" , value: 5},
    {name : "June" , value: 6},
    {name : "July" , value: 7},
    {name : "August" , value :8},
    {name : "September" , value: 9},
    {name : "October" , value: 10},
    {name : "Novemeber" , value: 11},
    {name : "December" , value: 12}

]

//Check the year selected by the user

  if(Year === today.year){
    console.log("Matched Year")
  //If current year is selected show months only till current month
      var shows =[];
      var current = today.monthnum;
      console.log(today.monthnum)
      for(var i = 0 ; i < current; i++){
          shows.push(months[i]);
      }
      setSMB(shows)
      console.log(shows)
      }else{
        console.log("Previous Year")
  //If previous month is selected select all months
         setSMB(months)
          console.log(months);
      }

  }
  

const selectUserFilesMonths = (Year) => {
  const months = [
    {name : "January" , value: 1},
    {name : "February" , value: 2},
    {name : "March" , value: 3},
    {name : "April" , value: 4},
    {name : "May" , value: 5},
    {name : "June" , value: 6},
    {name : "July" , value: 7},
    {name : "August" , value :8},
    {name : "September" , value: 9},
    {name : "October" , value: 10},
    {name : "Novemeber" , value: 11},
    {name : "December" , value: 12}

]


//Check the year selected by the user

  if(Year === today.year){
  //If current year is selected show months only till current month
      var shows =[];
      var current = today.monthnum;

      for(var i = 0 ; i < current; i++){
          shows.push(months[i]);
      }
      setSMF(shows)
      }else{
  //If previous month is selected select all months
          setSMF(months)
          console.log(months);
      }

  }


  useEffect( () => {
    var years = [];  
     for(var current = start.year; current <= today.year ; current ++){
       years.push(current);
     }
     setSYB(years);
     setSYF(years);
     console.log(today.year)
     selectUserFilesMonths(today.year);
     selectUserBookMonths(today.year);
     setUMBMonth(today.monthnum);
     setUMBYear(today.year);
     setUMFMonth(today.monthnum);
     setUMFYear(today.year);
     setBweek(today.week);
     setFweek(today.week);
     props.GetUserMonthlybookUploads(today);
     props.GetUserMonthlyFileUploads(today);
     props.GetUserWeeklyFileUploads(today);
     props.GetUserWeeklyBookUploads(today);
  } ,[props.auth])

const changeBYear = (event) => {
  setUMBYear(event.target.value);
   var item = {};
   item.year = event.target.value;
   item.month = u_m_b_month;
   console.log(item);
  selectUserBookMonths(event.target.value);
  props.GetUserMonthlybookUploads(item);
  item.week = bweek;
  props.GetUserWeeklyBookUploads(item)
}

const changeFYear = (event) => {
  setUMFYear(event.target.value);
  var item = {};
  item.year = event.target.value;
  item.month = u_m_f_month;
  console.log(item);
  selectUserFilesMonths(event.target.value);
  props.GetUserMonthlyFileUploads(item);
  item.week = fweek;
  props.GetUserWeeklyFileUploads(item);
 
}


const changeBMonth = event => {
  setUMBMonth(event.target.value)
  var item = {}
  item.monthnum = event.target.value;
  item.year  = u_m_b_year
  console.log(item)
  props.GetUserMonthlybookUploads(item);
  item.week = bweek;
  props.GetUserWeeklyBookUploads(item)
}

const changeFMonth = event => {
  setUMFMonth(event.target.value)
  var item = {}
  item.monthnum =event.target.value;
  item.year  = u_m_f_year;
  console.log(item);
  //Update weekly file counter
  props.GetUserMonthlyFileUploads(item);
  item.week = fweek;
  props.GetUserWeeklyFileUploads(item);
}


  useEffect( () => {
    props.Getstats();
    props.GetMonthlyBookCount();
    props.GetUserUploads();
    props.GetMonthlyFileCount();
    console.log(today.month);
  } ,[props.auth])
  
useEffect( () => {
  const { stats} = props.stats;
  console.log(stats)
  stats.map((key => {
  setTime(key.Date)
  setUsercount(key.UserCount);
  setCategorycount(key.CategoryCount);
  setBookcount(key.BookCount);
  setFileCount(key.filesCount)
  }))
  
}, [props.stats])

//Listen for monthly book count
useEffect( () => {
  let array = []
  setCategories(props.monthlybooks.data.x);
  var Count = 0;
  array = props.monthlybooks.data.y;
  if(array){
    array.map(count => {
      Count = Count + count
    })
  }
  setPublishedBooks(Count);
  setData(props.monthlybooks.data.y)
  
}, [props.monthlybooks])


//Listen for monthly files count
useEffect( () => {
 setFileData(props.filescount.data.y);
 setFileCategories(props.filescount.data.x)

}, [props.filescount])



//Listen for User uploads
useEffect( () => {
 setUploadcategories(props.uploads.data.x);
 setUploaddata(props.uploads.data.y);

 if(props.uploads.monthlybookcounts){
  setUmbcategories(props.uploads.monthlybookcounts.x);
  setUmbdata(props.uploads.monthlybookcounts.y)
 }
 if(props.uploads.monthlyfilecounts){
  console.log(props.uploads.monthlyfilecounts)
   setUmfcategories(props.uploads.monthlyfilecounts.x);
   setUmfdata(props.uploads.monthlyfilecounts.y)
  }

  if(props.uploads.weeklybookcounts){
    console.log(props.uploads.weeklybookcounts)
    setUwbdata(props.uploads.weeklybookcounts.y);
    setUwbcategories(props.uploads.weeklybookcounts.x)
  }

  if(props.uploads.weeklyfilecounts){
    setUwfcategories(props.uploads.weeklyfilecounts.x);
    setUwfdata(props.uploads.weeklyfilecounts.y)
  }
}, [props.uploads])


  
 
  
//Handel Radio change

const handleRadioChange = (event) => {
  setValue(event.target.value);
  if(event.target.value === "Week"){
    props.GetWeeklyBookCount();
  }else{
    props.GetMonthlyBookCount();
  }
};


//Handel Radio change

const handleBookWeekChange = (event) => {
  console.log(event.target.value)
  setBweek(event.target.value)
  var items = {};
  items.week = event.target.value;
  items.monthnum = u_m_b_month;
  items.year = u_m_b_year;
  console.log(items)
  props.GetUserWeeklyBookUploads(items)

};


const handleFileWeekChange = (event) => {
  console.log(event.target.value);
  setFweek(event.target.value)
  var items = {};
  items.week = event.target.value;
  items.monthnum = u_m_f_month;
  items.year = u_m_f_year;
  props.GetUserWeeklyFileUploads(items);
};


const handleFileRadioChange = (event) => {
  setFilegraphtype(event.target.value);
  if(event.target.value === "Week"){
    props.GetWeeklyFileCount();
  }else{
    props.GetMonthlyFileCount();
  }
};

const MonthlyBookoptions = {
    chart: {
      type: "line"
    },
    title: {
      text: "Monthly Added Books  Count"
    },
    xAxis: {
      categories: categories,
      title: {text : "Months"}
    },
    yAxis: {
      title: {text : "Books"}

    },
    series: [
      {
        color: '#059e8a',
        name:"Monthly Books Added" ,
        data: data
      }
    ]
  };


  const MonthlyFilesoptions = {
    chart: {
      type: "line"
    },
    title: {
      text: "Monthly Added Files Count"
    },
    xAxis: {
      categories: filecategories,
      title: {text : "Months"}
    },
    yAxis: {
      title: {text : "Files"}

    },
    series: [
      {
        color: '#6f03fc',
        name:"Monthly total files added" ,
        data: filedata
      }
    ]
  };
  const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
   "May",
    "Jun",
    "Jul",
     "Aug",
     "Sep",
     "Oct",
    "Nov",
    "Dec"

]
  

const Useruploadsoptions = {
  chart: {
    type: "bar"
  },
  title: {
    text: "Total books uploaded by users"
  },
  xAxis: {
    categories: uploadcategories,
    title: {text : "Username"}
  },
  yAxis: {
    title: {text : "books"}

  },
  series: [
    {  color: '#ffa726',
      name:"Books Uploaded" ,
      data: uploaddata
    }
  ]
};

const UserBookuploadsMonthlyoptions = {
  chart: {
    type: "bar"
  },
  title: {
    text: "Monthly books uploaded by users"
  },
  xAxis: {
    categories: umbcategories,
    title: {text : "Username"}
  },
  yAxis: {
    title: {text : "books"}

  },
  series: [
    {  color: '#db48d9',
      name:"Books Uploaded" ,
      data: umbdata
    }
  ]
};


const UserBookuploadsWeeklyoptions = {
  chart: {
    type: "bar"
  },
  title: {
    text: `${monthArray[u_m_b_month-1] +" " +u_m_b_year } weekly book uploaded by users`
  },
  xAxis: {
    categories: uwbcategories,
    title: {text : "Username"}
  },
  yAxis: {
    title: {text : "books"}

  },
  series: [
    {  color: '#23E129',
      name:"Books Uploaded" ,
      data: uwbdata
    }
  ]
};


const UserFileuploadsMonthlyoptions = {
  chart: {
    type: "bar"
  },
  title: {
    text: "Monthly files uploaded by users"
  },
  xAxis: {
    categories: umfcategories,
    title: {text : "Username"}
  },
  yAxis: {
    title: {text : "books"}

  },
  series: [
    {  color: '#7C23E1',
      name:"Files Uploaded" ,
      data: umfdata
    }
  ]
};


const UserFileuploadsWeeklyoptions = {
  chart: {
    type: "bar"
  },
  title: {
    text: `${monthArray[u_m_f_month-1] +" " +u_m_f_year}  weekly files uploaded by users`
  },
  xAxis: {
    categories: uwfcategories,
    title: {text : "Username"}
  },
  yAxis: {
    title: {text : "books"}

  },
  series: [
    {  color: '#138CF6',
      name:"Files Uploaded" ,
      data: uwfdata
    }
  ]
};

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <LibraryBooksSharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Books</p>
              <h3 className={classes.cardTitle}>{bookcount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>updated on {time}</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <CategorySharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total categories</p>
               <h3 className={classes.cardTitle}>{categorycount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>updated on {time}</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="warning">
                <GroupSharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Users</p>
              <h3 className={classes.cardTitle}>{usercount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>updated on {time}</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <CloudUploadIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Files</p>
              <h3 className={classes.cardTitle}>{files}</h3>
            </CardHeader>
            <CardFooter stats>
             <div className={classes.stats}>updated on {time}</div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
          <Paper style = {{padding : "10px" }} elevation={1}>
            <RadioGroup  row aria-label="position" name="graphtype" value={value} onChange={handleRadioChange}>           
              <FormControlLabel value="Month" control={<Radio />} label="Monthly" />           
              <FormControlLabel value="Week" control={<Radio />} label="Weekly" />
            </RadioGroup>
            <h4>Total Published Books : {publishedbooks}</h4>
          <HighchartsReact style = {{marginBottom : "20px"}} highcharts={Highcharts} options={MonthlyBookoptions} />       
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
        <RadioGroup  row aria-label="position" name="graphtype" value={filegraphtype} onChange={handleFileRadioChange}>           
              <FormControlLabel value="Month" control={<Radio />} label="Monthly" />           
              <FormControlLabel value="Week" control={<Radio />} label="Weekly" />
        </RadioGroup>
           <h4>Total Files : {files}</h4>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={ MonthlyFilesoptions} />
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={Useruploadsoptions} />
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
         <GridContainer>
         <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="Month">
                      Month
                    </InputLabel>
                    <Select
                      labelId="Month"
                      id="select-month"
                      defaultValue={today.monthnum}
                      onChange={changeBMonth}
                    >   
                     
                     {show_months_books.map((month) => 
                         <MenuItem value= {month.value}>{month.name}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
              </GridItem>


              <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="Year">
                      Year
                    </InputLabel>
                    <Select
                      labelId="Year"
                      id="select-year"
                      defaultValue={today.year}
                      onChange={changeBYear}
                    >   
                     
                     {show_years_books.map((year) => 
                         <MenuItem value= {year}>{year}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
              </GridItem>
            </GridContainer>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={UserBookuploadsMonthlyoptions} />
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
        <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="BWeek">
                      Week
                    </InputLabel>
                    <Select
                      labelId="BWeek"
                      id="select-Bweek"
                      defaultValue={today.week}
                      onChange={handleBookWeekChange}
                    >                 
                         <MenuItem value= {1}>Week 1</MenuItem>
                         <MenuItem value= {2}>Week 2</MenuItem>
                         <MenuItem value= {3}>Week 3</MenuItem>
                         <MenuItem value= {4}>Week 4</MenuItem>
                         <MenuItem value= {5}>Week 5</MenuItem>
                         <MenuItem value= {6}>Week 6</MenuItem>
                    </Select>
                  </FormControl>
              </GridItem>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={UserBookuploadsWeeklyoptions} />
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
        <GridContainer>
        <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="Month">
                      Month
                    </InputLabel>
                    <Select
                      labelId="Month"
                      id="select-month"
                      defaultValue={today.monthnum}
                      onChange={changeFMonth}
                    >   
                     
                     {show_months_files.map((month) => 
                         <MenuItem value= {month.value}>{month.name}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
              </GridItem>


              <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="Year">
                      Year
                    </InputLabel>
                    <Select
                      labelId="Year"
                      id="select-year"
                      defaultValue={today.year}
                      onChange={changeFYear}
                    >   
                     
                     {show_years_files.map((year) => 
                         <MenuItem value= {year}>{year}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
              </GridItem>
              </GridContainer>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={UserFileuploadsMonthlyoptions} />
        </Paper>
        <br></br>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Paper style = {{padding : "10px" }} elevation={1}>
        <GridItem xs={12} sm={4} md={2}>
              <FormControl varient="filled" className={classes.formControl}>
                    <InputLabel id="Month">
                      Week
                    </InputLabel>
                    <Select
                      labelId="Week"
                      id="select-week"
                      defaultValue={today.week}
                      onChange={handleFileWeekChange}
                    >                 
                         <MenuItem value= {1}>Week 1</MenuItem>
                         <MenuItem value= {2}>Week 2</MenuItem>
                         <MenuItem value= {3}>Week 3</MenuItem>
                         <MenuItem value= {4}>Week 4</MenuItem>
                         <MenuItem value= {5}>Week 5</MenuItem>
                         <MenuItem value= {6}>Week 6</MenuItem>
                    </Select>
                  </FormControl>
              </GridItem>
        <HighchartsReact style = {{marginBottom : "20px"}}  highcharts={Highcharts} options={UserFileuploadsWeeklyoptions} />
        </Paper>
        <br></br>
        </GridItem>
      </GridContainer>
    </div>
  );
}
Dashboard.propTypes ={
  Getstats: propTypes.func.isRequired,
  GetMonthlyBookCount: propTypes.func.isRequired,
  GetUserUploads: propTypes.func.isRequired,
  GetMonthlyFileCount: propTypes.func.isRequired,
  GetWeeklyBookCount: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items,
  stats: state.stats,
  monthlybooks: state.monthlybooks,
  uploads: state.uploads,
  filescount: state.filescount

});

export default connect(mapStateToProps, {Getstats , GetMonthlyBookCount ,GetUserUploads , GetMonthlyFileCount , GetWeeklyBookCount ,GetWeeklyFileCount ,  GetUserWeeklyFileUploads , GetUserMonthlybookUploads , GetUserMonthlyFileUploads , GetUserWeeklyBookUploads})(Dashboard);