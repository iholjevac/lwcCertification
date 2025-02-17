import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats'
// imports

// import getSimilarBoats
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
    @track boatId;
    error;
    
    
    // public
    @ api get recordId() {
        // returns the boatId
        return this.boatId;
      }
      set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
          // sets the boatId value
          // sets the boatId attribute
      }
    
    // public
    @api similarBy;
    
    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
    similarBoats({ error, data }) {
        if(data){
            this.relatedBoats = data
            console.log(data)
        }else if(error){
            console.log(error)
        }
     }
    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
        this.currentBoat = event.detail.boatId
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                objectApiName: "Boat__c",
                actionName: 'view',
            },
        });
    }
    
  }
  