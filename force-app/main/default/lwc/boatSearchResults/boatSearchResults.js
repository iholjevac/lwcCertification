import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME from '@salesforce/schema/Boat__c.Name';
import PRICE from '@salesforce/schema/Boat__c.Price__c';
import LENGTH from '@salesforce/schema/Boat__c.Length__c';
import DECRIPTION from '@salesforce/schema/Boat__c.Description__c';
import {refreshApex} from '@salesforce/apex';

import {
    APPLICATION_SCOPE,
    createMessageContext,
    MessageContext,
    publish,
    releaseMessageContext,
    subscribe,
    unsubscribe,
} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';

// ...
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
  @api selectedBoatId;
  columns = [
    { label: 'Name', fieldName: 'Name', editable:true },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable:true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable:true },
    { label: 'Description', fieldName: 'Description__c', editable:true },
  ];
  boatTypeId = '';
  @api boats;
  isLoading = false;
  draftValues = [];
  
  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 
  @wire(getBoats, {boatTypeId: "$boatTypeId"})
  wiredBoats(result) { 
    console.log(result)
    this.boats = result;
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) { 
    this.isLoading = true;
    this.notifyLoading(this.isLoading)
    console.log(this.boatTypeId)
    if(boatTypeId){
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading)
    }

  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading)
    await refreshApex(this.boats)
   this.isLoading = false;
   this.notifyLoading(this.isLoading)

   }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    console.log('test')
    console.log(event.detail.boatId)
    this.selectedBoatId = event.detail.boatId
    this.sendMessageService(this.selectedBoatId)
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    console.log(boatId)
    const payload = {recordId: boatId}
    publish(this.messageContext, BOATMC, payload)
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    console.log("save data")
    // notify loading
    const updatedFields = event.detail.draftValues;
    
    console.log(updatedFields)
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((result) => {
        console.log(result) 
        this.refresh()
        this.draftValues = []
        this.isLoading = false;
        this.notifyLoading(this.isLoading)
        this.dispatchEvent(
            new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT
            }))
        })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: ERROR_TITLE,
                message: error,
                variant: ERROR_VARIANT
            }))
            this.isLoading = false;
            this.notifyLoading(this.isLoading)
    })
    .finally(() => {});
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
        this.dispatchEvent(new CustomEvent('loading'));
    } else {
        this.dispatchEvent(new CustomEvent('doneloading'));
    }  
   }
}