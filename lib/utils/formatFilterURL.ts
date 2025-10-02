export const formatFilterURL = (filters: Record<string, string>) => {
    const filterArray = Object.entries(filters);
        let newFilterArray : string[] = [];
        filterArray.map(([key, value]) => {
          newFilterArray.push(`${key}=${value}`)
        })
    return newFilterArray.join('&')
  }