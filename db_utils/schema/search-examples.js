// match all nodes of a specific label
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      searchReturn: "self"
    }  
  )
}

// match nodes of a specific label with specific props
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      matchByExactProps: {name: "cairo"}
      searchReturn: "self"
    }  
  )
}

// match nodes of a specific label with a partial value of a prop (case-insensitive)
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      matchByPartialProp: {name: "VE"}
      searchReturn: "self"
    }
  )
}

// match (self)-[]-(relative) return relative 
// id search is required
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      matchByExactProps: {id: "9156feaf-4d8a-4e78-b86c-2cb55e09d0bd"}
      searchReturn: "relative1"
      relative1: "station"
    }  
  )
}

// match (self)-[]-(relative) return self, relative
// id search is required
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      matchByExactProps: {id: "9156feaf-4d8a-4e78-b86c-2cb55e09d0bd"}
      searchReturn: "self, relative1"
      relative1: "station"
    }  
  )
}

// match (relative1)-[]-(self)-[]-(relative2) return self, relative1, relative2
// id search is required
{
  normalizedSearch(
    settings: {
      searchNode: "city"
      matchByExactProps: {id: "9156feaf-4d8a-4e78-b86c-2cb55e09d0bd"}
      searchReturn: "self, relative1, relative2"
      relative1: "station"
      relative2: "country"
    }  
  )
}
