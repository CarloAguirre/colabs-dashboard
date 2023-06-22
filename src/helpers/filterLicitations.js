
export const filterLicitations = (searchedLicitation, licitations) => {
    let filteredLicitations = null;

      filteredLicitations = licitations.filter((licitation) => {
        for (let key in licitation) {
          if (licitation.hasOwnProperty(key)) {
            const value = licitation[key];
            const lowercaseValue =
              typeof value === "string" ? value.toLowerCase() : value?.toString().toLowerCase();
            const lowercaseSearch = searchedLicitation.toLowerCase();
  
            if (lowercaseValue && lowercaseValue.includes(lowercaseSearch)) {
              return true;
            }
          }
        }
        return false;
        
      });
    
  
    return filteredLicitations;
  };
  