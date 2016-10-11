#R Script for getting and summarizing all of the data from a given flight file
library(dplyr)
library(ggplot2)

brq <- as.numeric(seq(0, 2400, 100))

getDataFromFile = function(fileName){
  #read the file from the directory
  flights <- read.csv(fileName)
  
  #Filter on the main airlines and get the necessary columns
  d <- flights %>% 
    filter(UniqueCarrier == "AA" | UniqueCarrier == "DL" | UniqueCarrier == "CO" | UniqueCarrier == "NW" | UniqueCarrier == "UA" | UniqueCarrier == "US" | UniqueCarrier == "WN") %>% 
    select(Year, UniqueCarrier, CRSDepTime, ArrDelay)
  
  #create bins for the time of day
  d$bins <- cut(d$CRSDepTime, breaks = brq, labels = FALSE)
  
  #Create a dataframe with the total number of flights by airline
  totals <- d[complete.cases(d),] %>% group_by(UniqueCarrier)
  totals <- summarise(totals, flightbyCarrier = n())
  
  #Summarize the dataframe and find the total amount of delay incurred by each airline
  d <- d[complete.cases(d),] %>% group_by(UniqueCarrier, bins, Year) %>% 
    summarise(totalArrivalDelay = sum(ArrDelay))
  
  #add the totals to the already existing dataframe
  merged <- merge(x = d, y = totals, by="UniqueCarrier")
  
  #create a new column with the delay profile
  merged <- merged %>% mutate(delayProfile = totalArrivalDelay/flightbyCarrier)
  
  #merged$hour <- rep.int(seq(1, 24), nrow(merged)/24)
  
  #Generate a Graph just to make sure everything is ok
  #ggplot(merged, aes(x = as.factor(bins), y = delayProfile, color = UniqueCarrier)) + geom_bar(stat = "identity", position = "dodge")
  
  return(merged)
}

listAndWrite = function(debug = FALSE){
  i <- 0
  #Iterate through the list of files and call the get data from file function
  for(file in list.files(path="./RawData/", pattern="*.csv", full.names=T)){
    print(paste("Working on", file))
    
    if(i == 0){
      allData <- getDataFromFile(file)
    }else{
      allData <- rbind(allData, getDataFromFile(file))
    }
    
    i <- i + 1
  }
  
  #write to a file
  write.csv(allData, file="data.csv")
  
  if(debug){
    #return the data, used for debugging
    return(allData)
  }
}