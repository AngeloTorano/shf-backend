const Joi = require("joi")
const ResponseHandler = require("../utils/responseHandler")

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }))

      return ResponseHandler.validationError(res, errors)
    }

    next()
  }
}

// Common validation schemas
const schemas = {
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  createUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string()).min(1).required(),
  }),

  createPatient: Joi.object({
    shf_id: Joi.string().max(50),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    gender: Joi.string().max(50),
    date_of_birth: Joi.date(),
    age: Joi.number().integer().min(0).max(150),
    mobile_number: Joi.string().max(50),
    mobile_sms: Joi.boolean(),
    alternative_number: Joi.string().max(50),
    alternative_sms: Joi.boolean(),
    region_district: Joi.string().max(100),
    city_village: Joi.string().max(100),
    highest_education_level: Joi.string().max(100),
    employment_status: Joi.string().max(100),
    school_name: Joi.string().max(255),
    school_phone_number: Joi.string().max(50),
  }),

  createSupply: Joi.object({
    category_id: Joi.number().integer().required(),
    item_name: Joi.string().max(255).required(),
    description: Joi.string(),
    current_stock_level: Joi.number().integer().min(0).required(),
    unit_of_measure: Joi.string().max(50),
    reorder_level: Joi.number().integer().min(0),
    status: Joi.string().max(50),
  }),

  // Phase 1 schemas
  phase1Registration: Joi.object({
    patient_id: Joi.number().integer().required(),
    registration_date: Joi.date().required(),
    city: Joi.string().max(100),
    has_hearing_loss: Joi.string().max(50),
    uses_sign_language: Joi.string().max(50),
    uses_speech: Joi.string().max(50),
    hearing_loss_causes: Joi.array().items(Joi.string()),
    ringing_sensation: Joi.string().max(50),
    ear_pain: Joi.string().max(50),
    hearing_satisfaction_18_plus: Joi.string().max(50),
    conversation_difficulty: Joi.string().max(50),
  }),

  earScreening: Joi.object({
    patient_id: Joi.number().integer().required(),
    phase_id: Joi.number().integer(),
    screening_name: Joi.string().max(50),
    ears_clear_left: Joi.string().max(50),
    ears_clear_right: Joi.string().max(50),
    otc_wax: Joi.number().integer(),
    otc_infection: Joi.number().integer(),
    otc_perforation: Joi.number().integer(),
    otc_tinnitus: Joi.number().integer(),
    otc_atresia: Joi.number().integer(),
    otc_implant: Joi.number().integer(),
    otc_other: Joi.number().integer(),
    medical_recommendation: Joi.string().max(50),
    medication_given: Joi.array().items(Joi.string()),
    left_ears_clear_for_fitting: Joi.string().max(50),
    right_ears_clear_for_fitting: Joi.string().max(50),
    comments: Joi.string(),
  }),

  hearingScreening: Joi.object({
    patient_id: Joi.number().integer().required(),
    phase_id: Joi.number().integer(),
    screening_method: Joi.string().max(100),
    left_ear_result: Joi.string().max(50),
    right_ear_result: Joi.string().max(50),
    hearing_satisfaction_18_plus_pass: Joi.string().max(50),
  }),

  earImpression: Joi.object({
    patient_id: Joi.number().integer().required(),
    ear_impression: Joi.string().max(10),
    comment: Joi.string(),
  }),

  finalQCP1: Joi.object({
    patient_id: Joi.number().integer().required(),
    ear_impressions_inspected_collected: Joi.boolean(),
    shf_id_number_id_card_given: Joi.boolean(),
  }),

  // Phase 2 schemas
  phase2Registration: Joi.object({
    patient_id: Joi.number().integer().required(),
    registration_date: Joi.date().required(),
    city: Joi.string().max(100),
    patient_type: Joi.string().max(100),
  }),

  fittingTable: Joi.object({
    patient_id: Joi.number().integer().required(),
    fitting_left_power_level: Joi.string().max(100),
    fitting_left_volume: Joi.string().max(100),
    fitting_left_model: Joi.string().max(100),
    fitting_left_battery: Joi.string().max(50),
    fitting_left_earmold: Joi.string().max(100),
    fitting_right_power_level: Joi.string().max(100),
    fitting_right_volume: Joi.string().max(100),
    fitting_right_model: Joi.string().max(100),
    fitting_right_battery: Joi.string().max(50),
    fitting_right_earmold: Joi.string().max(100),
  }),

  fitting: Joi.object({
    patient_id: Joi.number().integer().required(),
    number_of_hearing_aid: Joi.number().integer(),
    special_device: Joi.string().max(100),
    normal_hearing: Joi.number().integer(),
    distortion: Joi.number().integer(),
    implant: Joi.number().integer(),
    recruitment: Joi.number().integer(),
    no_response: Joi.number().integer(),
    other: Joi.number().integer(),
    comment: Joi.string(),
    clear_for_counseling: Joi.boolean(),
  }),

  counseling: Joi.object({
    patient_id: Joi.number().integer().required(),
    received_aftercare_information: Joi.boolean(),
    trained_as_student_ambassador: Joi.boolean(),
  }),

  finalQCP2: Joi.object({
    patient_id: Joi.number().integer().required(),
    batteries_provided_13: Joi.number().integer(),
    batteries_provided_675: Joi.number().integer(),
    hearing_aid_satisfaction_18_plus: Joi.string().max(50),
    confirmation: Joi.boolean(),
    qc_comments: Joi.string(),
  }),

  // Phase 3 schemas
  phase3Registration: Joi.object({
    patient_id: Joi.number().integer().required(),
    registration_date: Joi.date().required(),
    country: Joi.string().max(100),
    city: Joi.string().max(100),
    type_of_aftercare: Joi.string().max(100),
    service_center_school_name: Joi.string().max(255),
    return_visit_custom_earmold_repair: Joi.boolean(),
    problem_with_hearing_aid_earmold: Joi.string().max(50),
  }),

  aftercareAssessment: Joi.object({
    patient_id: Joi.number().integer().required(),
    eval_hearing_aid_dead_broken: Joi.number().integer(),
    eval_hearing_aid_internal_feedback: Joi.number().integer(),
    eval_hearing_aid_power_change_needed: Joi.number().integer(),
    eval_hearing_aid_power_change_too_low: Joi.number().integer(),
    eval_hearing_aid_power_change_too_loud: Joi.number().integer(),
    eval_hearing_aid_lost_stolen: Joi.number().integer(),
    eval_hearing_aid_no_problem: Joi.number().integer(),
    eval_earmold_discomfort_too_tight: Joi.number().integer(),
    eval_earmold_feedback_too_loose: Joi.number().integer(),
    eval_earmold_damaged_tubing_cracked: Joi.number().integer(),
    eval_earmold_lost_stolen: Joi.number().integer(),
    eval_earmold_no_problem: Joi.number().integer(),
    service_tested_wfa_demo_hearing_aids: Joi.number().integer(),
    service_hearing_aid_sent_for_repair_replacement: Joi.number().integer(),
    service_not_benefiting_from_hearing_aid: Joi.number().integer(),
    service_refit_new_hearing_aid: Joi.number().integer(),
    service_retubed_unplugged_earmold: Joi.number().integer(),
    service_modified_earmold: Joi.number().integer(),
    service_fit_stock_earmold: Joi.number().integer(),
    service_took_new_ear_impression: Joi.number().integer(),
    service_refit_custom_earmold: Joi.number().integer(),
    gs_counseling: Joi.boolean(),
    gs_batteries_provided: Joi.boolean(),
    gs_batteries_13_qty: Joi.number().integer(),
    gs_batteries_675_qty: Joi.number().integer(),
    gs_refer_aftercare_service_center: Joi.boolean(),
    gs_refer_next_phase2_mission: Joi.boolean(),
    comment: Joi.string(),
  }),

  finalQCP3: Joi.object({
    patient_id: Joi.number().integer().required(),
    hearing_aid_satisfaction_18_plus: Joi.string().max(50),
    ask_people_to_repeat_themselves: Joi.string().max(50),
    notes_from_shf: Joi.string(),
  }),

  // Location schemas
  createCountry: Joi.object({
    iso_code: Joi.string().max(3).required(),
    country_name: Joi.string().max(100).required(),
  }),

  createCity: Joi.object({
    city_name: Joi.string().max(100).required(),
    country_id: Joi.number().integer().required(),
  }),

  assignUserLocation: Joi.object({
    user_id: Joi.number().integer().required(),
    country_id: Joi.number().integer(),
    city_id: Joi.number().integer(),
  }).or('country_id', 'city_id'),

  updateStock: Joi.object({
    quantity: Joi.number().integer().required(),
    transaction_type: Joi.string().required(),
    notes: Joi.string(),
  }),
}

module.exports = {
  validateRequest,
  schemas,
}
