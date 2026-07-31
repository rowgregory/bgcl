export const validateJobApplication = (step: number, formData: any, setErrors: any) => {
  const newErrors: Record<string, string> = {}

  switch (step) {
    case 1: // Position & Background
      if (!formData?.positionTypes?.length) {
        newErrors.positionTypes = 'At least one position is required'
      }
      if (!formData?.youthOrgEmployment?.trim()) {
        newErrors.youthOrgEmployment = 'Please indicate your youth organization employment history'
      }
      if (!formData?.education?.trim()) {
        newErrors.education = 'Education is required'
      }
      // extracurricularsSkills is optional — no validation needed

      break
    case 2: // Personal Info
      if (!formData?.applicantName?.trim()) {
        newErrors.applicantName = 'Name is required'
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
      if (!formData?.employmentType) {
        newErrors.employmentType = 'Employment type is required'
      }
      if (!formData?.hoursAvailable?.trim()) {
        newErrors.hoursAvailable = 'Hours available is required'
      }

      break

    case 3: // References
      const references = formData?.references || []
      // if (references.length < 3) {
      //   newErrors.references = '3 references are required'
      // }

      for (let index = 0; index < 3; index++) {
        const ref = references[index]

        if (!ref?.name?.trim()) {
          newErrors[`name_${index}`] = `Name is required`
        }
        if (!ref?.positionAndCompany?.trim()) {
          newErrors[`positionAndCompany_${index}`] = `Position & company is required`
        }
        if (!ref?.workRelationship?.trim()) {
          newErrors[`workRelationship_${index}`] = `Work relationship is required`
        }
        if (!ref?.phone?.trim()) {
          newErrors[`phone_${index}`] = `Phone number is required`
        } else if (!/^[\d\s\-\(\)\+]{10,}$/.test(ref.phone)) {
          newErrors[`phone_${index}`] = `Invalid phone number`
        }
        if (!ref?.email?.trim()) {
          newErrors[`email_${index}`] = `Email is required`
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
          newErrors[`email_${index}`] = `Invalid email format`
        }
      }
      break

    case 4: // Driving Info
      if (formData?.hasValidDriverLicense === undefined || formData?.hasValidDriverLicense === null) {
        newErrors.hasValidDriverLicense = "Please indicate if you have a valid driver's license"
      }
      if (formData?.hasValidDriverLicense === true) {
        if (!formData?.licenseNumber?.trim()) {
          newErrors.licenseNumber = 'License number is required'
        }
        if (!formData?.licenseExpiration) {
          newErrors.licenseExpiration = 'License expiration date is required'
        } else if (new Date(formData.licenseExpiration) < new Date()) {
          newErrors.licenseExpiration = 'License is expired'
        }
      }
      if (formData?.hasValidDriverLicense === false) {
        if (!formData?.noLicenseReason?.trim()) {
          newErrors.noLicenseReason = "Please explain why you don't have a license"
        }
      }
      if (formData?.licenseSuspended === true) {
        if (!formData?.suspensionExplanation?.trim()) {
          newErrors.suspensionExplanation = 'Please explain the suspension'
        }
      }
      break

    case 5: // Resume
      // Uncomment to make resume required:
      if (!formData?.resumeUrl) {
        newErrors.resumeUrl = 'Resume is required'
      }
      break

    case 6: // Certification
      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms'
      }
      if (!formData?.certifyInformation) {
        newErrors.certifyInformation = 'You must certify the information is accurate'
      }
      if (!formData?.authorizeBackground) {
        newErrors.authorizeBackground = 'You must authorize the background check'
      }
      if (!formData?.understandActiveStatus) {
        newErrors.understandActiveStatus = 'You must acknowledge the active status requirement'
      }
      if (!formData?.signature?.trim()) {
        newErrors.signature = 'Signature is required'
      }
      break
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
