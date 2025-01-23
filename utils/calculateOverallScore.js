function calculateOverallScore(peopleAverages, processAverages, technologyAverages) {
    const totalSum = 
      peopleAverages.standard.sum + 
      peopleAverages.professional.sum + 
      peopleAverages.enterprise.sum + 
      processAverages.standard.sum + 
      processAverages.professional.sum + 
      processAverages.enterprise.sum + 
      technologyAverages.standard.sum + 
      technologyAverages.professional.sum + 
      technologyAverages.enterprise.sum;
  
    const totalCount = 
      peopleAverages.standard.count + 
      peopleAverages.professional.count + 
      peopleAverages.enterprise.count + 
      processAverages.standard.count + 
      processAverages.professional.count + 
      processAverages.enterprise.count + 
      technologyAverages.standard.count + 
      technologyAverages.professional.count + 
      technologyAverages.enterprise.count;
  
    return totalSum / totalCount;
  }
  
  module.exports = { calculateOverallScore };
  