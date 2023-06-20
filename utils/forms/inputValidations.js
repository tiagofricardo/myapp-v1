export const fullName_validation = {
  name: "name",
  label: "Full Name",
  type: "text",
  id: "name",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    maxLength: {
      value: 30,
      message: "Max 30 characters",
    },
  },
};

export const email_validation = {
  name: "email",
  label: "Email address",
  type: "email",
  id: "email",
  placeholder: "Your email address",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Invalid Email",
    },
  },
};

export const password_validation = {
  name: "password",
  label: "Password",
  type: "password",
  id: "password",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    minLength: {
      value: 6,
      message: "Min 6 characters",
    },
  },
};

export const name_validation = {
  name: "name",
  label: "Name",
  type: "text",
  id: "name",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    minLength: {
      value: 6,
      message: "Min 6 characters",
    },
    maxLength: {
      value: 30,
      message: "Max 30 characters",
    },
  },
};

export const description_validation = {
  name: "description",
  label: "Description",
  type: "text",
  id: "description",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    minLength: {
      value: 6,
      message: "Min 6 characters",
    },
    maxLength: {
      value: 250,
      message: "Max 250 characters",
    },
  },
};

export const price_validation = {
  name: "price",
  label: "Price (€)",
  type: "number",
  id: "price",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    pattern: {
      value: /^\d+([,.]\d{1,2})?$/,
      message: "Price should be an integer with 2 decimal digits max",
    },
  },
};

export const time_validation = {
  name: "time",
  label: "Time (min)",
  type: "number",
  id: "time",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    pattern: {
      value: /^\d{1,3}$/,
      message: "Time should have 3 digits max",
    },
  },
};

export const category_validation = {
  name: "categoryId",
  label: "Category",
  type: "select",
  id: "categoryId",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    validate: (value) => value !== "0" || "Please select a category",
  },
};

export const color_validation = {
  name: "color",
  label: "Color",
  type: "select",
  id: "colorId",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};

export const service_validation = {
  name: "serviceId",
  label: "Service",
  type: "select",
  id: "serviceId",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    validate: (value) => value !== "0" || "Please select a service",
  },
};

export const phoneNumber_validation = {
  name: "phonenumber",
  label: "PhoneNumber",
  type: "number",
  id: "phonenumberId",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
    pattern: {
      value: /^(?:\+351)?9[1236]\d{7}$/,
      message: "Phone number is not valid",
    },
  },
};

export const startDatePicker_validation = {
  name: "startDatePicker",
  label: "Start Date",
  id: "startDatePickerId",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};

export const endDatePicker_validation = {
  name: "endDatePicker",
  label: "End Date",
  id: "endDatePickerId",
  startDateValidation: "",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};
