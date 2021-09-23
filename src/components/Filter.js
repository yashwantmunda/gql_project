import React from 'react'
import { FormControl, Select, MenuItem, InputLabel, Box, Typography, Button } from '@mui/material';
import { useState } from 'react';

export default function Filter({cities, techTags,cityFilter,techFilter,removeFilter}) {
    const [cityName, setCityName] = useState('');
    const [techName, setTechName] = useState('');

    const techHandle = (e) => {
        setTechName(e.target.value);
        techFilter(e.target.value);
    }

    const cityHandle = (e) => {
        setCityName(e.target.value);
        cityFilter(e.target.value);
    }

    const removeActiveFilter = () => {
        setTechName('');
        setCityName('');
        removeFilter();
    }

    return (
        <Box sx={{m:'40px auto',maxWidth:'1280px',width:'100%',overflow:'auto'}}>
            <Typography sx={{m:'10px 0'}} component="h2" variant="h4">Filters:</Typography>
            <FormControl sx={{minWidth:'200px'}}>
                <InputLabel id="cityLabel">City</InputLabel>
                <Select
                    labelId="cityLabel"
                    id="city_select"
                    value={cityName}
                    label="City" 
                    onChange={cityHandle}  
                >
                {
                    cities.map(city => (<MenuItem key={city.slug} value={city.slug}>{city.name}</MenuItem>))
                }
                    
                </Select>
            </FormControl>
            <FormControl sx={{minWidth:'200px',ml:'20px'}}>
                <InputLabel id="countryLabel">Tech</InputLabel>
                <Select
                    labelId="countryLabel"
                    id="countrySelect"
                    value={techName}
                    label="Tech"
                    onChange={techHandle} 
                >
                    {
                    techTags.map((tag,index) => {
                        return <MenuItem key={index} value={tag}>{tag}</MenuItem>
                    })
                }
                </Select>
            </FormControl>
            <Button onClick={removeActiveFilter} sx={{ml:'25px'}} variant="contained" color="secondary">
                Remove filters
            </Button>
        </Box>
    )
}
