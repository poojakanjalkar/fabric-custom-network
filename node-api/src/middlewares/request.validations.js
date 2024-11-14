const Joi = require('joi');

// Define the schema for the organizations
const organizationSchema = Joi.object({
    key: Joi.string().required(),
    orgType: Joi.valid('Orderer', 'Peer').required(),
    orgName: Joi.string().alphanum().max(50).required(), // Alphanumeric, max 50 characters
    ca: Joi.string().required(),
    msp: Joi.string().required(),
    isEditable: Joi.boolean().required(),
    peerCount: Joi.number().integer().min(1).max(15).required(), // Positive integer, max 15
    stateDB: Joi.string().valid('NA').optional(),
    db: Joi.string().valid('Not Require', 'Couchdb').optional()
});

// Define the schema for the channels
const channelSchema = Joi.object({
    key: Joi.string().required(),
    channelName: Joi.string()
        .pattern(/^[a-z][a-z0-9-]*$/) // Must start with a lowercase letter and can contain lowercase letters, digits, dots, and dashes
        .max(50) // Maximum length of 50 characters
        .required(), // Required field
    ChaincodeName: Joi.string()
        .pattern(/^[a-z][a-z0-9-]*$/) // Same pattern as channel name
        .max(50) // Maximum length of 50 characters
        .required(), // Required field
    orgName: Joi.array().items(Joi.string()).required(), // Array of organization names
    endorsement: Joi.string().required(),
    dataType: Joi.string().valid('Channel').required()
});

// Define the main schema for the whole object
const requestSchema = {
    body: Joi.object({
        projectName: Joi.string().required(),
        Organizations: Joi.array()
            .items(organizationSchema)
            .max(50) // Maximum of 50 organizations
            .min(2)
            .required(),
        channels: Joi.array()
            .items(channelSchema)
            .max(50) // Maximum of 50 channels
            .min(1)
            .required()
    }).custom((value, helpers) => {
        // Check that the orgName in channels contains valid organization names from Organizations
        const orgNames = value.Organizations.map(org => org.orgName);
        for (const channel of value.channels) {
            const invalidOrgs = channel.orgName.filter(org => !orgNames.includes(org));
            if (invalidOrgs.length > 0) {
                return helpers.error('any.invalid', { message: `Invalid organization names in channel ${channel.channelName}: ${invalidOrgs.join(', ')}` });
            }
        }
        return value; // Validation passed
    })
}


module.exports = {
    requestSchema
}