const { websiteSchema, developerSchema } = require("../../core-service");
const { applyFilters } = require("../event");


websiteSchema.pre('init',function (next) {
    const modifiedDoc = applyFilters('before_init_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })
  websiteSchema.pre('save',function (next) {
    const modifiedDoc = applyFilters('before_save_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  websiteSchema.pre('validate',function (next) {
    const modifiedDoc = applyFilters('before_validate_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  websiteSchema.pre('remove',function (next) {
    const modifiedDoc = applyFilters('before_remove_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })


  websiteSchema.post('init',function (next) {
    const modifiedDoc = applyFilters('after_init_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  websiteSchema.post('save',function (next) {
    const modifiedDoc = applyFilters('after_save_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  websiteSchema.post('validate',function (next) {
    const modifiedDoc = applyFilters('after_validate_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  websiteSchema.post('remove',function (next) {
    const modifiedDoc = applyFilters('after_remove_website',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })
  


  developerSchema.pre('init',function (next) {
    const modifiedDoc = applyFilters('before_init_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })
  developerSchema.pre('save',function (next) {
    const modifiedDoc = applyFilters('before_save_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  developerSchema.pre('validate',function (next) {
    const modifiedDoc = applyFilters('before_validate_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  developerSchema.pre('remove',function (next) {
    const modifiedDoc = applyFilters('before_remove_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })


  developerSchema.post('init',function (next) {
    const modifiedDoc = applyFilters('after_init_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  developerSchema.post('save',function (next) {
    const modifiedDoc = applyFilters('after_save_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  developerSchema.post('validate',function (next) {
    const modifiedDoc = applyFilters('after_validate_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })

  developerSchema.post('remove',function (next) {
    const modifiedDoc = applyFilters('after_remove_developer',this.toObject());
    Object.assign(this, modifiedDoc);
    next();
  })