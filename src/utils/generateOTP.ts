const generateOTP = ():number => {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000)
    console.log(generatedOTP)
    return generatedOTP
}

export default generateOTP
