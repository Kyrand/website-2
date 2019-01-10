/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';
    
    nbviz.data = {};
    nbviz.valuePerCapita = false;
    nbviz.ALL_CATS = 'All Categories';
    nbviz.ALL_NATS = 'All Nationalities';
    nbviz.activeCountry = null;
    nbviz.TRANS_DURATION = 2000;
    nbviz.MAX_CENTROID_RADIUS = 30,
    nbviz.MIN_CENTROID_RADIUS = 2;
    nbviz.COLORS = {palegold:'#E6BE8A'};
    
    var cats = nbviz.CATEGORIES = [
        "Physiology or Medicine", "Peace", "Physics", "Literature", "Chemistry", "Economics"]; 
    
    nbviz.categoryFill = function(category){
        var i = cats.indexOf(category);
        return d3.hcl(i / cats.length * 360, 60, 70);
    };

    var nestDataByYear = function(entries) {
        return nbviz.data.years = d3.nest()
            .key(function(w) {
                return w.year;
            })
            .entries(entries);
    };
    
    nbviz.filterByCountries = function(countryNames) {
        
        if(!countryNames.length){
            nbviz.natDim.filter();
        }
        else{
            nbviz.natDim.filter(function(name) {
                return countryNames.indexOf(name) > -1;
            });
        }
        
        if(countryNames.length === 1){
            nbviz.activeCountry = countryNames[0];
        }
        else{
            nbviz.activeCountry = null;
        }
        nbviz.onDataChange();
    };

    nbviz.filterByCategory = function(cat) {
        if(cat === nbviz.ALL_CATS){
            nbviz.catDim.filter();
        }
        else{
            nbviz.catDim.filter(cat);
        }
        nbviz.onDataChange();
    };

    nbviz.getCountryData = function() {
        var countryGroups = nbviz.natDim.group().all();

        // make main data-ball
        var data = countryGroups.map( function(c) {
            var cData = nbviz.data.nationalData[c.key];
            var value = c.value;
            // if per-capita value then divide by pop. size
            if(nbviz.valuePerCapita === true){
                value /= cData.population;
            }
            return {
                key: c.key,
                value: value,
                code: cData.alpha3Code,
                // population: cData.population
            };
        })
            .sort(function(a, b) {
                return b.value - a.value; // descending
            });

        return data;
    };

    nbviz.onDataChange = function() {
        var data = nbviz.getCountryData();
        nbviz.updateBarChart(data);
        nbviz.updateMap(data);
        nbviz.updateList(nbviz.natDim.top(Infinity));
        data = nestDataByYear(nbviz.natDim.top(Infinity));
        nbviz.updateTimeChart(data);
    };
    
}(window.nbviz = window.nbviz || {}, _, $));
