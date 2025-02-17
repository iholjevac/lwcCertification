import { LightningElement, wire, api } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';


// import getBoatTypes from the BoatDataService => getBoatTypes method';
export default class BoatSearchForm extends LightningElement {
    @api selectedBoatTypeId = '';
    
    // Private
    error = undefined;
    
    searchOptions;
    
    // Wire a custom Apex method
      @wire(getBoatTypes)
      boatTypes({ error, data }) {
      if (data) {
        this.searchOptions = data.map(type => {
          // TODO: complete the logic
          console.log(type)
        return {
            label:type.Name,
            value:type.Id
        }   
        });
        this.searchOptions.unshift({ label: 'All Types', value: '' });
      } else if (error) {
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      console.log(event.target.value)
      //this.selectedBoatTypeId = event.detail.value
      this.selectedBoatTypeId=event.target.value;
      //console.log(this.selectedBoatTypeId)  
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      const searchEvent = new CustomEvent('search', {
        // detail contains only primitives
        detail: {boatTypeId: this.selectedBoatTypeId}
    });
      this.dispatchEvent(searchEvent);
    }
  }