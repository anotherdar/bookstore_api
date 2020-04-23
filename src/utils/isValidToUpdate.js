const isValidToUpdate = (body, options = []) => {                  
    const updates = Object.keys(body)                              
    return updates.every((update) => options.includes(update))     
}    


module.exports = {
    isValidToUpdate
}
                                                                   