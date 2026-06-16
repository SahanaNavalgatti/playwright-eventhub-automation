## Assignments Overview

This repository contains multiple Playwright test files. The main assignment files are:

| Assignment | Test File | Purpose |
|---|---|---|
| Assignment 1 | `tests/Assignment1.spec.js` | Creates a new event, books one ticket, validates booking confirmation, and verifies that seat count is reduced by 1 |
| Assignment 2 | `tests/Assignment2.spec.js` | Validates refund eligibility for single-ticket and group-ticket bookings |


## Assignment 1 - Event Creation, Booking and Seat Reduction

**Test file:** `tests/Assignment.spec.js`

### Objective

The objective of Assignment 1 is to automate the complete event booking flow.

### Scenario Covered

1. Login to EventHub
2. Create a new event from the Admin page
3. Capture available seats before booking
4. Book one ticket
5. Validate booking confirmation
6. Navigate back to Events page
7. Verify that available seats are reduced by 1

### Expected Result

The test should pass when the event is created successfully, booking confirmation is displayed, and the seat count is reduced by one after booking.
