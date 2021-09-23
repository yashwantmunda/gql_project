import React from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell,TableHead, TableRow,TableContainer, Paper, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useState } from 'react';
import {useQuery,gql } from "@apollo/client";
import Filter from '../components/Filter';
import Graph from '../components/Graph';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


 


export default function JobList() {

    const JOB_LIST = gql`
    query jobListings{
        jobs{
          title
          cities{
            name
            slug
          }
          company{
            name
          }
          countries{
            name
            slug 
          }
          tags{
              name
          }
         
        }
      }
    `;

    const CITY_LIST = gql`
        query{
            cities{
            name
            slug
            }
        }
    `;

    let filteredJobData = [];
    let [citySelected, setCitySelected] = useState('');
    let [techSelected, setTechSelected] = useState('');
    let [techTagList, setTechTagList] = useState([]);
    let companyListeeJob = {};
    let [companyNames, setCompanyName] = useState([]);
    let [jobCount, setJobCount] = useState([]);
    let [emptyData, setEmptyData] = useState(false);
    // let [filteredData,setFilteredData] = useState([]);
    const [jobData, setjobData] = useState([]);
    const [cityList, setCityList] = useState([]);
    // const [countryList, setCountryList] = useState([]);
    let [filteredData,setFilteredData] = useState(jobData);

    // Job list fetch query with other state
    const { loading:jobDataLoading, error:jobDataError } = useQuery(JOB_LIST,{
        onCompleted: (data) => {
            setjobData(data.jobs);
            setFilteredData(data.jobs);
            let techList = [];
           data.jobs.map(job => {
                if(companyListeeJob[`${job.company.name}`]){
                    companyListeeJob[`${job.company.name}`] +=1;
                }
                else{
                    companyListeeJob[`${job.company.name}`] = 1;
                }
                job.tags.map(tag => techList.indexOf(tag.name) === -1 ? techList.push(tag.name): null);
                return null;
                
            });
            setTechTagList(techList);
            setCompanyName(Object.keys(companyListeeJob));
            setJobCount(Object.values(companyListeeJob));
        }
    });

    // City list fetch query
    useQuery(CITY_LIST,{
        onCompleted: (data) => {
            setCityList(data.cities);
        }
    });

   
// graph plotting data filter function
    const dataFilter = (list) => {
        companyListeeJob = {}
        list.map(job => {
            if(companyListeeJob[`${job.company.name}`]){
                companyListeeJob[`${job.company.name}`] +=1;
            }
            else{
                companyListeeJob[`${job.company.name}`] = 1;
            }
            return null;
        });
        setCompanyName(Object.keys(companyListeeJob));
        setJobCount(Object.values(companyListeeJob));

    }

    // Job filter based on the city
    const filterCity = (selectedCity) => {
        setCitySelected(selectedCity);
        filteredJobData = jobData;
        let sanitizeData = [];
        if(techSelected === ''){
            sanitizeData  = filteredJobData.filter(d => d.cities.map(city => Object.values(city).indexOf(selectedCity) > -1 ).indexOf(true) > -1);
        }else{
            sanitizeData = filteredJobData.filter(d => d.cities.map(city => Object.values(city).indexOf(selectedCity) > -1 ).indexOf(true) > -1 && d.tags.map(tag => tag.name === techSelected).indexOf(true) > -1);
        }
        
        filteredJobData = sanitizeData;
        setFilteredData(filteredJobData);
        dataFilter(filteredJobData);
        if(filteredJobData.length === 0){
            setEmptyData(true);
        }else{
            setEmptyData(false);
        }
    }

    // Job filter based on the Tags(tech)
    const filterTech = (selectedTech) => {
        
        setTechSelected(selectedTech);
        filteredJobData = jobData;
        let sanitizeData = [];
        if(citySelected === ''){
            sanitizeData = filteredJobData.filter(d => d.tags.map(tag => tag.name === selectedTech).indexOf(true) > -1);
        }else{
            sanitizeData = filteredJobData.filter(d => d.cities.map(city => Object.values(city).indexOf(citySelected) > -1 ).indexOf(true) > -1 && d.tags.map(tag => tag.name === selectedTech).indexOf(true) > -1);
        }
        
        filteredJobData = sanitizeData;
        setFilteredData(filteredJobData);
        dataFilter(filteredJobData);
        if(filteredJobData.length === 0){
            setEmptyData(true);
        }else{
            setEmptyData(false);
        }
    }

    // Remove filter function
    const removeFilters = () => {
        setTechSelected(''); 
        setCitySelected('');
        setFilteredData(jobData);
        dataFilter(jobData);
        setEmptyData(false);
    }
    
   

    if (jobDataLoading) return <Typography align="center" component="h4" variant="h5">Loading...</Typography>;
    if (jobDataError) return <Typography align="center" component="h4" variant="h5">Something went wrong</Typography>;
    //if (emptyData) return <Typography align="center" component="h4" variant="h5">Sorry, no data found</Typography>
    return (
        <>
        <Filter removeFilter={removeFilters} cityFilter={filterCity} techFilter={filterTech} cities={cityList} techTags={techTagList} />
        { emptyData ? <Typography align="center" component="h4" variant="h5">Sorry, no data found</Typography> : 
        <>
        <TableContainer component={Paper} sx={{maxWidth:'1280px',maxHeight:'440px',overflow:"scroll",m:'60px auto'}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead sx={{position:'sticky',top:'0'}}>
                <TableRow>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell align="right">Location</StyledTableCell>
                    <StyledTableCell align="right">Company</StyledTableCell>
                    <StyledTableCell align="right">Featured</StyledTableCell>
                   
                    {/* <StyledTableCell align="right">Published on</StyledTableCell> */}
                    
                    
                </TableRow>
                </TableHead>
                <TableBody>
                {filteredData.map((row,index) => (
                    <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                        {row.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        {row.cities.map(city => city.name+',')}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.company.name}</StyledTableCell>
                    
                    <StyledTableCell align="right">{row.tags.map(tag => tag.name+', ')}</StyledTableCell>
                    {/* <StyledTableCell align="right">{row.postedAt}</StyledTableCell> */}
                 
                    
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        
        <Graph xdata={companyNames} ydata={jobCount}/>
        </>
        }
        </>
    )
}
