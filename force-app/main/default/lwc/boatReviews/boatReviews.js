import { LightningElement, api } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews'
import { NavigationMixin } from 'lightning/navigation';

// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    @api boatId;
    error;
    @api boatReviews;
    @api isLoading = false;
    
    // Getter and Setter to allow for logic to run on recordId change
    get recordId() {
        console.log(this.boatId)
        return this.boatId;
     }
    @api set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);        

      //sets boatId assignment
      this.boatId = value;
      //get reviews associated with boatId
      this.getReviews()
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
        if(this.boatReviews != null || this.boatReviews != undefined){
            return true;
        }else{
            return false;
        }
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api refresh() { 
        this.getReviews()
        this.isLoading=false;
    }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() {
        this.isLoading = true;
        getAllReviews({ boatId: this.boatId })
        .then((result) => {
            if(!result.length){
                this.isLoading = false;
                return;
            }else{
                this.boatReviews = result
                this.isLoading = false;
                console.log(result)
            }
        })
        .catch((error) => {
            this.error = error;
            this.boatReviews = undefined;

        });
        console.log(this.boatReviews)
     }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) { 
        event.preventDefault();
        event.stopPropagation();
        let recordId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: "User",
                actionName: 'view',
            },
        });
     }
  }
  