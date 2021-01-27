/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ListingFilter {
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
}

export enum ListingType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
}

export interface ConnectStripeInput {
  code: string;
}

export interface HostListingInput {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
  numOfGuests: number;
}

export interface LogInInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
