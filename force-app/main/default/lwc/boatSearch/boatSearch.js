import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


 // imports
 export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        this.isLoading = false;
    }
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId);

    }
    
    createNewBoat() {
        console.log('test')
            // Opens the new Account record modal
            // to create an Account.
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Boat__c',
                    actionName: 'new'
                }
            });
     }
  }