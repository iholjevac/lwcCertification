import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// imports
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c'
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name'
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c'
import BOAT_FIELD from '@salesforce/schema/BoatReview__c.Boat__c'

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT     = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    @api boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    boat = BOAT_FIELD;
    ratingField = RATING_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    @api myFields = [BOAT_FIELD, NAME_FIELD, COMMENT_FIELD, RATING_FIELD]
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api get recordId() { 
      return this.boatId;
    }
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);        
    //test changes

      //sets boatId assignment
      this.boatId = value;
      //another change
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
      console.log(event.detail.rating)
      this.rating = event.detail.rating
      //return this.rating;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) { 
        console.log('submited')
        console.log(event.detail)
        event.preventDefault()
        event.detail.fields.Rating__c = this.rating
        event.detail.fields.Boat__c = this.boatId
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);


        // this.nameField = event.detail.fields.Name
        // this.commentField = event.detail.fields.Comment__c
        // this.boat = this.boatId
        // this.ratingField = this.rating;

        console.log(this.boat)
    }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      this.dispatchEvent(
        new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: "success",
            variant: SUCCESS_VARIANT
        }))
      this.handleReset();
      console.log('success')
      // TODO: dispatch the custom event and show the success message
      const event = new CustomEvent('createreview', {
        // detail contains only primitives
      });
      this.dispatchEvent(event);
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() {
      //this.template.querySelector('lightning-record-edit-form').reset();
      const inputFields = this.template.querySelectorAll('lightning-input-field');
      if (inputFields) {
          inputFields.forEach(field => {
              field.reset();
          });
      }
    }
  }
  