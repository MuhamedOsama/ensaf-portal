<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card color="grey lighten-4 pa-3">
          <v-card-title v-if="stepper == 1">Claim</v-card-title>
          <v-card-title v-if="stepper == 2">Creditor</v-card-title>
          <v-card-title v-if="stepper == 3">Debit</v-card-title>
          <v-card-title v-if="stepper == 4">Bank Information</v-card-title>
          <v-card-title v-if="stepper == 5"
            >Additional Information</v-card-title
          >
          <v-card-title v-if="stepper == 6">File Attachments</v-card-title>

          <v-card-subtitle v-if="stepper == 1"
            >Complete This Form with Information About Claim</v-card-subtitle
          >
          <v-card-subtitle v-if="stepper == 2">
            Complete This Form with Creditor Data
          </v-card-subtitle>
          <v-card-subtitle v-if="stepper == 3">
            Complete This Form with Debit Data
          </v-card-subtitle>
          <v-card-subtitle v-if="stepper == 4">
            Complete This Form with Bank Information
          </v-card-subtitle>
          <v-card-subtitle v-if="stepper == 5">
            Complete This Form with Additional Information
          </v-card-subtitle>
          <v-card-subtitle v-if="stepper == 6">
            Complete This Form with File Attachments
          </v-card-subtitle>
          <v-card-text>
            <v-stepper v-model="stepper" color="grey lighten-4" elevation="0">
              <v-stepper-header class="grey lighten-2">
                <v-stepper-step step="1" :complete="stepper > 1">
                  Claim Data
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="2" :complete="stepper > 2">
                  Creditor Data
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="3" :complete="stepper > 3">
                  Debit Data
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="4" :complete="stepper > 4">
                  Bank Information
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="5" :complete="stepper > 5">
                  Additional Information
                  <small>Optional</small>
                </v-stepper-step>
              </v-stepper-header>
              <v-expand-transition> </v-expand-transition>
              <v-stepper-items>
                <v-stepper-content step="1" class="grey lighten-4">
                  <v-form v-model="claimDataValid" class="pt-2">
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          outlined
                          v-model="claim.claimType"
                          label="Claim Type"
                          :items="claimTypes"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          outlined
                          label="Creditor Type"
                          v-model="claim.creditorType"
                          :items="creditorTypes"
                        >
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-expand-transition>
                      <v-text-field
                        outlined
                        label="Other"
                        v-if="claim.claimType == 7"
                      ></v-text-field>
                    </v-expand-transition>

                    <v-text-field
                      outlined
                      label="Type of Bankruptcy Procedure Opened For The Debtor"
                    />
                    <v-text-field outlined label="Opening deed" />
                    <v-text-field
                      outlined
                      label="Value in Saudi Ryal"
                      type="number"
                    />
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          outlined
                          label="Reason"
                          :items="claimReasonTypes"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          outlined
                          label="Payment Status"
                          :items="PaymentStatuses"
                          v-model="claim.PaymentStatus"
                        />
                      </v-col>
                    </v-row>
                    <v-expand-transition>
                      <v-text-field
                        outlined
                        v-if="claim.PaymentStatus == 2"
                        label="Amount Paid In Ryal Saudi"
                        type="number"
                      />
                    </v-expand-transition>

                    <v-menu
                      v-model="calimDueDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="fade-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          v-model="claim.dueDate"
                          label="Due Date"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-hijri-date-picker
                        locale="ar"
                        v-model="claim.dueDate"
                        @input="calimDueDateMenu = false"
                      />
                    </v-menu>
                    <v-file-input
                      prepend-icon=""
                      prepend-inner-icon="mdi-attachment"
                      label="Maturity bond (Document Supporting / Proving the claim)"
                      outlined
                    >
                    </v-file-input>
                    <v-checkbox
                      v-model="claim.hasGuarantees"
                      label="Are There Guarantees?"
                    ></v-checkbox>
                    <v-expand-transition>
                      <v-select
                        outlined
                        v-if="claim.hasGuarantees"
                        :items="warrantiesTypes"
                        v-model="claim.warrantiesType"
                        label="Select Warranty Type"
                      />
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-file-input
                        v-if="claim.hasGuarantees"
                        prepend-icon=""
                        prepend-inner-icon="mdi-attachment"
                        label="Guarantees Document"
                        outlined
                      >
                      </v-file-input>
                    </v-expand-transition>
                    <v-text-field outlined label="Applicant's Name" />

                    <v-select
                      outlined
                      label="Adjective"
                      v-model="claim.AdjectiveType"
                      :items="AdjectiveTypes"
                    />
                    <v-expand-transition>
                      <v-text-field
                        outlined
                        v-model="claim.agencyNumber"
                        label="Agency Number"
                        v-if="
                          claim.AdjectiveType == 1 || claim.AdjectiveType == 2
                        "
                      />
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-text-field
                        outlined
                        label="Identification Number"
                        v-model="claim.identificationNumber"
                        v-if="
                          claim.AdjectiveType == 1 || claim.AdjectiveType == 2
                        "
                      />
                    </v-expand-transition>
                    <v-file-input
                      prepend-icon=""
                      prepend-inner-icon="mdi-attachment"
                      label="Adjective Document"
                      outlined
                    >
                    </v-file-input>
                    <v-menu
                      v-model="applicationDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="fade-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          v-model="claim.applicationDate"
                          label="The Date of Application"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-hijri-date-picker
                        locale="ar"
                        v-model="claim.applicationDate"
                        @input="calimDueDateMenu = false"
                      />
                    </v-menu>
                    <v-checkbox
                      label="I acknowledge that all the data and documents attached
                          to the application for listing our claim as a creditor
                          of the debtor Saudi Oger Company - under liquidation -
                          which were attached to the website as true copies and
                          under my responsibility, and that all the data written
                          in the application for listing the claim are written
                          with my knowledge, correct and under my
                          responsibility. This is our acknowledgment of this,
                          and if it is proven otherwise, I will be subject to
                          legal accountability."
                      v-model="IndividualAgreementBox"
                    >
                    </v-checkbox>
                  </v-form>
                </v-stepper-content>
                <v-stepper-content step="2" class="grey lighten-4">
                  <v-expand-transition>
                    <div v-if="stepper == 2">
                      <v-form v-model="creditorDataValid" class="pt-2">
                        <v-row class="mb-4">
                          <v-col cols="12">
                            <vue-phone-number-input
                              color="dodgerblue"
                              v-model="yourValue"
                            ></vue-phone-number-input>
                          </v-col>
                        </v-row>

                        <v-text-field
                          outlined
                          label="Name of Creditor In Arabic"
                        ></v-text-field>
                        <v-row>
                          <v-col cols="6">
                            <v-menu
                              v-model="workStartDateMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="fade-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  outlined
                                  v-model="claim.creditorData.workStartDate"
                                  label="Work Start Date"
                                  prepend-inner-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-hijri-date-picker
                                locale="ar"
                                v-model="claim.creditorData.workStartDate"
                                @input="workStartDateMenu = false"
                              />
                            </v-menu>
                          </v-col>
                          <v-col cols="6">
                            <v-menu
                              v-model="workEndDateMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="fade-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  outlined
                                  v-model="claim.creditorData.workEndDate"
                                  label="Work End Date"
                                  prepend-inner-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-hijri-date-picker
                                locale="ar"
                                v-model="claim.creditorData.workEndDate"
                                @input="workEndDateMenu = false"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-text-field label="Email" outlined></v-text-field>
                        <v-select
                          outlined
                          label="Nationality"
                          :items="nationalities"
                          v-model="claim.creditorData.nationality"
                        ></v-select>
                        <v-expand-transition>
                          <v-text-field
                            outlined
                            label="ID Number"
                            v-if="claim.creditorData.nationality == 'Saudi'"
                          ></v-text-field>
                        </v-expand-transition>
                        <v-expand-transition>
                          <v-text-field
                            outlined
                            label="Passport Number"
                            v-if="claim.creditorData.nationality != 'Saudi'"
                          ></v-text-field>
                        </v-expand-transition>
                        <v-select
                          outlined
                          label="Organization"
                          :items="organizations"
                          v-model="claim.creditorData.organization"
                        ></v-select>
                        <v-text-field
                          label="Iqama Id"
                          outlined
                          v-if="
                            claim.creditorData.organization == 1 &&
                            claim.creditorData.nationality != 'Saudi'
                          "
                        >
                        </v-text-field>
                        <v-text-field
                          label="Address in Saudi Arabia"
                          outlined
                          v-if="claim.creditorData.organization == 1"
                        >
                        </v-text-field>

                        <v-select
                          outlined
                          label="Country"
                          v-if="claim.creditorData.organization == 2"
                        ></v-select>
                        <v-text-field
                          label="City"
                          outlined
                          v-if="claim.creditorData.organization == 2"
                        >
                        </v-text-field>
                      </v-form>
                    </div>
                  </v-expand-transition>
                </v-stepper-content>

                <v-stepper-content step="3" class="grey lighten-4">
                  <v-expand-transition>
                    <div v-if="stepper == 3">
                      <v-form v-model="debitDataValid" class="pt-2">
                        <v-text-field
                          outlined
                          label="Name"
                          v-model="claim.debitData.name"
                        />
                        <v-text-field
                          outlined
                          label="ID Number / Commercial Register"
                          v-model="claim.debitData.idNumber"
                        />
                      </v-form>
                    </div>
                  </v-expand-transition>
                </v-stepper-content>

                <v-stepper-content step="4" class="grey lighten-4">
                  <v-expand-transition>
                    <div v-if="stepper == 4">
                      <v-form v-model="bankInformationValid" class="pt-2">
                        <v-text-field
                          outlined
                          label="IBAN"
                          :rules="ibanRules"
                          v-model="claim.bankInformation.iban"
                        />
                        <v-text-field
                          :rules="requiredArabicRules"
                          label="Bank name in Arabic"
                          v-model="claim.bankInformation.bankNameArabic"
                          outlined
                        />
                        <v-select
                          label="Country"
                          outlined
                          v-model="claim.bankInformation.country"
                        ></v-select>
                        <v-select
                          label="Nationality"
                          outlined
                          :items="nationalities"
                          v-model="claim.bankInformation.nationality"
                        ></v-select>
                        <v-text-field
                          :rules="requiredEnglishRules"
                          label="Bank Name in English"
                          v-model="claim.bankInformation.bankNameEnglish"
                          outlined
                        />
                        <v-file-input
                          prepend-icon=""
                          prepend-inner-icon="mdi-attachment"
                          label="Proof of Account Number Document"
                          outlined
                        />
                      </v-form>
                    </div>
                  </v-expand-transition>
                </v-stepper-content>
                <v-stepper-content step="5" class="grey lighten-4">
                  <v-expand-transition>
                    <div v-if="stepper == 5">
                      <v-form v-model="additionalInformationValid" class="pt-2">
                        <v-text-field
                          readonly
                          label="Category"
                          disabled
                          outlined
                          v-model="claim.additionalInformation.category"
                        />
                        <v-select
                          outlined
                          label="Relationship"
                          :items="relationshipTypes"
                          v-model="claim.additionalInformation.relationship"
                        ></v-select>
                        <v-autocomplete
                          :outlined="!!claim.additionalInformation.relationship"
                          label="First Detail"
                          :disabled="!claim.additionalInformation.relationship"
                          v-model="claim.additionalInformation.firstDetails"
                          :items="firstDetailTypesFiltered"
                        ></v-autocomplete>
                      </v-form>
                    </div>
                  </v-expand-transition>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="stepper >= 2"
              large
              @click="stepper = stepper - 1"
              elevation="0"
              text
              >Back <v-icon class="ml-3">mdi-arrow-left</v-icon></v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              v-if="stepper >= 1 && stepper <= 4"
              large
              @click="stepper = stepper + 1"
              elevation="0"
              text
              :disabled="!creditorDataValid"
              >Continue <v-icon class="ml-3">mdi-arrow-right</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VHijriDatePicker from "vuetify-umalqura";
import VuePhoneNumberInput from "vue-phone-number-input";

export default {
  data: () => ({
    stepper: 3,
    yourValue: "",
    organizations: [
      { text: "Inside Saudi Arabic", value: 1 },
      { text: "Outside Saudi Arabia", value: 2 },
    ],
    nationalities: ["Saudi", "Non Saudi"],
    calimDueDateMenu: false,
    applicationDateMenu: false,
    additionalInformationValid: false,
    firstDetailTypes: [
      "Accountant",
      "Engineer",
      "Representative",
      "Manager",
      "Worker",
      "Driver",
      "Cooker",
      "Administrative",
      "Lawyer",
      "Consultant",
      "Guarantee",
      "FalteringProject",
    ],
    relationshipTypes: [
      { text: "Employee", value: 1 },
      { text: "Retired", value: 2 },
      { text: "Beneficiary", value: 3 },
    ],
    AdjectiveTypes: [
      { text: "Applicant", value: 1 },
      { text: "Agent", value: 2 },
      { text: "Regular Representative", value: 3 },
    ],
    creditorTypes: [
      { text: "Individual Employee", value: 1 },
      { text: "Company", value: 2 },
      { text: "Institution", value: 3 },
      { text: "Banks", value: 4 },
      { text: "Government Institution", value: 5 },
    ],
    warrantiesTypes: [
      { text: "Commercial (for example Car, Real Estate)", value: 1 },
      { text: "Other", value: 2 },
    ],
    claimReasonTypes: [
      { text: "Termination The Contract of Workers", value: 1 },
      { text: "Eligibility for Government Payments", value: 2 },
    ],
    PaymentStatuses: [
      { text: "Not Paid", value: 1 },
      { text: "Part Paid", value: 2 },
    ],
    claimTypes: [
      { text: "Labor", value: 1 },
      { text: "Government", value: 2 },
      { text: "Commercial", value: 3 },
      { text: "Financial", value: 4 },
      { text: "Original Claim", value: 5 },
      { text: "Financial Request", value: 6 },
      { text: "Other", value: 7 },
    ],
    claimDataValid: false,
    creditorDataValid: false,
    workStartDateMenu: false,
    hasGuarantees: false,
    workEndDateMenu: false,
    claim: {
      AdjectiveType: 1,
      applicationDate: "",
      identificationNumber: "",
      agencyNumber: "",
      creditorType: 1,
      claimType: 1,
      GuaranteesDocument: "",
      warrantiesType: "",
      dueDate: "",
      PaymentStatus: 1,
      creditorData: {
        CreditorNameArabic: "",
        WorkStartDate: "",
        WorkEndDate: "",
        nationality: "",
        organization: "",
        iqamaId: "",
        passportNumber: "",
      },
      debitData: {
        name: "",
        idNumber: "",
      },
      bankInformation: {
        iban: "",
        bankNameArabic: "",
        country: "",
        nationality: "",
        bankNameEnglish: "",
        proofOfAccountNumberDocument: "",
      },
      additionalInformation: {
        category: "Individual",
        relationship: "",
        firstDetails: "",
      },
    },
    ibanRules: [
      (v) => !!v || "Field is Required",
      (v) => !isNaN(v) || "Numbers Only",
      (v) => v.length == 24 || "Must be exactly 24 numbers",
    ],
    requiredRules: [(v) => !!v || "Field is Required"],
    arabicRules: [
      (v) =>
        new RegExp(/^[\u0621-\u064A0-9 ]+$/).test(v) || "Must be in arabic",
    ],
    englishRules: [
      (v) =>
        new RegExp(/^[A-Za-z][A-Za-z0-9]*$/).test(v) || "Must be in english",
    ],
    requiredEnglishRules: [
      (v) => !!v || "Field is Required",
      (v) =>
        new RegExp(/^[A-Za-z][A-Za-z0-9]*$/).test(v) || "Must be in english",
    ],
    requiredArabicRules: [
      (v) => !!v || "Field is Required",
      (v) =>
        new RegExp(/^[\u0621-\u064A0-9 ]+$/).test(v) || "Must be in arabic",
    ],
    IndividualAgreementBox: false,
  }),
  computed: {
    firstDetailTypesFiltered() {
      const relationship = this.claim.additionalInformation.relationship;
      if (relationship == 1) {
        return [
          "Accountant",
          "Engineer",
          "Representative",
          "Manager",
          "Worker",
          "Driver",
          "Cooker",
          "Administrative",
          "Lawyer",
          "Consultant",
        ];
      } else if (relationship == 2) {
        return ["Lawyer", "Consultant"];
      } else if (relationship == 3) {
        return [" Guarantee", "FalteringProject"];
      }
    },
  },
};
</script>

<style>
</style>