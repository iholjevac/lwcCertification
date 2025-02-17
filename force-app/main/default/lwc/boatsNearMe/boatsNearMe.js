import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// imports
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {latitude: "$latitude", longitude:"$longitude", boatTypeId: "$boatTypeId"})
  wiredBoatsJSON({error, data}) { 
    console.log(data)
    this.isLoading = true;
    if (data) {
        this.createMapMarkers(data)
      }else if(error){
        this.dispatchEvent(
            new ShowToastEvent({
                title: ERROR_TITLE,
                message: error,
                variant: ERROR_VARIANT
            }))
        this.isLoading = false;
      } 
  }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { 
    if(!this.isRendered){
        this.getLocationFromBrowser();
    }
    this.isRendered = true;
  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() { 
    navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
  }

  // Creates the map markers
  createMapMarkers(boatData) {
     // const newMarkers = boatData.map(boat => {...});
     // newMarkers.unshift({...});
      const newMarkers = JSON.parse(boatData).map(boat => {
          // TODO: complete the logic
          console.log(boat)
        return {
                title: boat.Name,
                location: {
                  Latitude: boat.Geolocation__Longitude__s,
                  Longitude: boat.Geolocation__Latitude__s,
              },
              } 
         });
        //this.newMarkers.unshift({ label: 'All Types', value: '' })  
        newMarkers.unshift({
            title : LABEL_YOU_ARE_HERE,
            icon : ICON_STANDARD_USER,
            location : {
                Latitude : this.latitude,
                Longitude : this.longitude
            }
        });      
        this.mapMarkers = newMarkers;
        this.isLoading = false;
   }

}