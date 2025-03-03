import { api, LightningElement, wire } from 'lwc';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import {
  APPLICATION_SCOPE,
  MessageContext,
  subscribe,
} from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';


// Custom Labels Imports

// import labelDetails for Details
// import labelReviews for Reviews
// import labelAddReview for Add_Review
// import labelFullDetails for Full_Details
// import labelPleaseSelectABoat for Please_select_a_boat
// Boat__c Schema Imports
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelDetails from '@salesforce/label/c.Details';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id'
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name'
import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
import BOAT_LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOAT_PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  @api boatId;
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  @wire(getRecord, {recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord; 

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    if(this.wiredRecord.data){
        return 'utility:anchor'
    }else{
        return null;
    }
   }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    //console.log(JSON.stringify(this.wiredRecord))
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
   }
  
  // Private
  subscription = null;

  @wire(MessageContext)
  messageContext;
  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    if (this.subscription || this.recordId) {
        return;
      }
      // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
      this.subscription = subscribe(
        this.messageContext,
        BOATMC,
        (message) => {this.boatId = message.recordId},
        { scope: APPLICATION_SCOPE }
    );
  }
  
  // Calls subscribeMC()
  connectedCallback() { 
    this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() { 
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.boatId,
            actionName: 'view'
        }
    });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { 
    this.template.querySelector('lightning-tabset').activeTabValue = "test";
    this.template.querySelector('c-boat-reviews').refresh();
  }
}
