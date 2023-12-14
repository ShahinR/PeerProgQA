// Import mandatory config files
import "./commands"
require("cypress-failed-log")

// Turn off uncaught exception handling unhandled promise rejections
Cypress.on("uncaught:exception", (err, runnable, promise) => {
  if (promise) {
    return false
  }
})



