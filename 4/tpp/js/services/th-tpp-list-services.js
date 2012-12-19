/*
  list services:
    yesNoService - returns yes or no
    roleService - returns a list of roles
    subjectService - returns a list of subjects
    countryService - returns a list of countries
    educationLevelService - returns a list of education levels
    referenceTypeService - returns a list of reference types
    refereePositionService - returns a list of referee positions
    computerSkillService - returns a list of computer skills
    teachingSkillService - returns a list of teaching skills
    languageService - returns a list of languages
    preferenceLevelService - returns a list of preference levels
    locationService - returns a list of locations
    curriculumService - returns a list of curricula
    ageLevelService - returns a list of age levels
    birthYearService - returns a list of birth years
    maritalStatusService - returns a list of marital statuses
    ... - returns a list of ...
*/

angular.module('tpp').
  service('yesNoService', function() {
    return {
      yesNo: [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" }
      ]
    }
  }).
  service('roleService', function() {
    return {
      roles: [
        { id: 21, name: "Classroom teacher" },
        { id: 22, name: "Early Years / Kindergarten Teacher" },
        { id: 23, name: "Head of Department" },
        { id: 24, name: "Primary / Elementary Teacher" },
        { id: 25, name: "Head of School" },
        { id: 26, name: "Counsellor" },
        { id: 27, name: "Curriculum Coordinator" },
        { id: 28, name: "Deputy Head / Vice Principal" },
        { id: 29, name: "Director of Studies" },
        { id: 30, name: "Educational Psychologist" },
        { id: 31, name: "English as a Foreign Language Teacher" },
        { id: 32, name: "Head of Primary/Elementary" },
        { id: 33, name: "Head of Secondary" },
        { id: 34, name: "Head of Section" },
        { id: 35, name: "Head of Year (pastoral)" },
        { id: 36, name: "IB PYP Coordinator" },
        { id: 37, name: "IB MYP Coordinator" },
        { id: 38, name: "IB DP Coordinator" },
        { id: 39, name: "Librarian" },
        { id: 41, name: "Other Position" },
        { id: 42, name: "Special Needs Teacher" },
        { id: 43, name: "Subject Leader" },
        { id: 44, name: "Teaching Assistant" }
      ]
    }
  }).
  service('subjectService', function() {
    return {
      subjects: [
        { id: 21, name: "Archaeology" },
        { id: 22, name: "Arabic" },
        { id: 23, name: "Architecture" },
        { id: 24, name: "Art and Design" },
        { id: 25, name: "Biology" },
        { id: 26, name: "Business Studies" },
        { id: 27, name: "Careers" },
        { id: 28, name: "Chemistry" },
        { id: 29, name: "Computing" },
        { id: 30, name: "Curriculum Manager" },
        { id: 31, name: "Design & Technology" },
        { id: 32, name: "Drama" },
        { id: 33, name: "Early Years/ Kindergarten" },
        { id: 34, name: "Economics" },
        { id: 35, name: "English" },
        { id: 36, name: "English as a Foreign Language" },
        { id: 37, name: "Environmental Systems and Societies (ESS)" },
        { id: 38, name: "Food Technology" },
        { id: 39, name: "Foreign Languages" },
        { id: 40, name: "French" },
        { id: 41, name: "Geography" },
        { id: 42, name: "German" },
        { id: 43, name: "History" },
        { id: 44, name: "Humanities" },
        { id: 45, name: "Information Technology" },
        { id: 46, name: "Italian" },
        { id: 47, name: "Law" },
        { id: 48, name: "Mathematics" },
        { id: 49, name: "Mandarin" },
        { id: 50, name: "Media Studies" },
        { id: 51, name: "Middle School Generalist" },
        { id: 52, name: "Music" },
        { id: 53, name: "Librarian" },
        { id: 54, name: "Not Applicable" },
        { id: 55, name: "Pastoral Manager" },
        { id: 56, name: "Physical Education" },
        { id: 57, name: "Physics" },
        { id: 58, name: "Politics" },
        { id: 59, name: "Portuguese" },
        { id: 60, name: "Primary / Elementary" },
        { id: 61, name: "Psychology" },
        { id: 62, name: "Religious Education" },
        { id: 63, name: "Science" },
        { id: 64, name: "Senior Manager" },
        { id: 65, name: "Social Sciences" },
        { id: 66, name: "Spanish" },
        { id: 67, name: "Special Education Needs (SEN)" },
        { id: 68, name: "Supply Teacher" },
        { id: 69, name: "Teaching Assistant" },
        { id: 70, name: "TOK" }
      ]
    }
  }).
  service('countryService', function() {
    return {
      countriesSelect2FormatFunction: function(item) { //*** TODO: move the images location + move towards using a single image for all flags + consider where best to put this function
        return "<img class='flag' src='http://beta.teacherhorizons.com/static/prototypes/design/registration/static/images/flags/" + item.text.toLowerCase() + ".png'/>" + item.text;
      },
      countries: [
        { id: 21, name: "United States" },
        { id: 22, name: "United Kingdom" },
        { id: 23, name: "Afghanistan" },
        { id: 24, name: "Albania" },
        { id: 25, name: "Algeria" },
        { id: 26, name: "American Samoa" },
        { id: 27, name: "Andorra" },
        { id: 28, name: "Angola" },
        { id: 29, name: "Anguilla" },
        { id: 30, name: "Antarctica" },
        { id: 31, name: "Antigua and Barbuda" },
        { id: 32, name: "Argentina" },
        { id: 33, name: "Armenia" },
        { id: 34, name: "Aruba" },
        { id: 35, name: "Australia" },
        { id: 36, name: "Austria" },
        { id: 37, name: "Azerbaijan" },
        { id: 38, name: "Bahamas" },
        { id: 39, name: "Bahrain" },
        { id: 40, name: "Bangladesh" },
        { id: 41, name: "Barbados" },
        { id: 42, name: "Belarus" },
        { id: 43, name: "Belgium" },
        { id: 44, name: "Belize" },
        { id: 45, name: "Benin" },
        { id: 46, name: "Bermuda" },
        { id: 47, name: "Bhutan" },
        { id: 48, name: "Bolivia" },
        { id: 49, name: "Bosnia and Herzegovina" },
        { id: 50, name: "Botswana" },
        { id: 51, name: "Bouvet Island" },
        { id: 52, name: "Brazil" },
        { id: 53, name: "British Indian Ocean Territory" },
        { id: 54, name: "Brunei Darussalam" },
        { id: 55, name: "Bulgaria" },
        { id: 56, name: "Burkina Faso" },
        { id: 57, name: "Burundi" },
        { id: 58, name: "Cambodia" },
        { id: 59, name: "Cameroon" },
        { id: 60, name: "Canada" },
        { id: 61, name: "Cape Verde" },
        { id: 62, name: "Cayman Islands" },
        { id: 63, name: "Central African Republic" },
        { id: 64, name: "Chad" },
        { id: 65, name: "Chile" },
        { id: 66, name: "China" },
        { id: 67, name: "Christmas Island" },
        { id: 68, name: "Cocos (Keeling) Islands" },
        { id: 69, name: "Colombia" },
        { id: 70, name: "Comoros" },
        { id: 71, name: "Congo" },
        { id: 72, name: "Congo, The Democratic Republic of The" },
        { id: 73, name: "Cook Islands" },
        { id: 74, name: "Costa Rica" },
        { id: 75, name: "Cote Divoire" },
        { id: 76, name: "Croatia" },
        { id: 77, name: "Cuba" },
        { id: 78, name: "Cyprus" },
        { id: 79, name: "Czech Republic" },
        { id: 80, name: "Denmark" },
        { id: 81, name: "Djibouti" },
        { id: 82, name: "Dominica" },
        { id: 83, name: "Dominican Republic" },
        { id: 84, name: "Ecuador" },
        { id: 85, name: "Egypt" },
        { id: 86, name: "El Salvador" },
        { id: 87, name: "Equatorial Guinea" },
        { id: 88, name: "Eritrea" },
        { id: 89, name: "Estonia" },
        { id: 90, name: "Ethiopia" },
        { id: 91, name: "Falkland Islands (Malvinas)" },
        { id: 92, name: "Faroe Islands" },
        { id: 93, name: "Fiji" },
        { id: 94, name: "Finland" },
        { id: 95, name: "France" },
        { id: 96, name: "French Guiana" },
        { id: 97, name: "French Polynesia" },
        { id: 98, name: "French Southern Territories" },
        { id: 99, name: "Gabon" },
        { id: 100, name: "Gambia" },
        { id: 101, name: "Georgia" },
        { id: 102, name: "Germany" },
        { id: 103, name: "Ghana" },
        { id: 104, name: "Gibraltar" },
        { id: 105, name: "Greece" },
        { id: 106, name: "Greenland" },
        { id: 107, name: "Grenada" },
        { id: 108, name: "Guadeloupe" },
        { id: 109, name: "Guam" },
        { id: 110, name: "Guatemala" },
        { id: 111, name: "Guinea" },
        { id: 112, name: "Guinea-bissau" },
        { id: 113, name: "Guyana" },
        { id: 114, name: "Haiti" },
        { id: 115, name: "Heard Island and Mcdonald Islands" },
        { id: 116, name: "Holy See (Vatican City State)" },
        { id: 117, name: "Honduras" },
        { id: 118, name: "Hong Kong" },
        { id: 119, name: "Hungary" },
        { id: 120, name: "Iceland" },
        { id: 121, name: "India" },
        { id: 122, name: "Indonesia" },
        { id: 123, name: "Iran, Islamic Republic of" },
        { id: 124, name: "Iraq" },
        { id: 125, name: "Ireland" },
        { id: 126, name: "Israel" },
        { id: 127, name: "Italy" },
        { id: 128, name: "Jamaica" },
        { id: 129, name: "Japan" },
        { id: 130, name: "Jordan" },
        { id: 131, name: "Kazakhstan" },
        { id: 132, name: "Kenya" },
        { id: 133, name: "Kiribati" },
        { id: 134, name: "Korea, Democratic People Republic of" },
        { id: 135, name: "Korea, Republic of" },
        { id: 136, name: "Kuwait" },
        { id: 137, name: "Kyrgyzstan" },
        { id: 138, name: "Lao People Democratic Republic" },
        { id: 139, name: "Latvia" },
        { id: 140, name: "Lebanon" },
        { id: 141, name: "Lesotho" },
        { id: 142, name: "Liberia" },
        { id: 143, name: "Libya" },
        { id: 144, name: "Liechtenstein" },
        { id: 145, name: "Lithuania" },
        { id: 146, name: "Luxembourg" },
        { id: 147, name: "Macao" },
        { id: 148, name: "Macedonia, The Former Yugoslav Republic of" },
        { id: 149, name: "Madagascar" },
        { id: 150, name: "Malawi" },
        { id: 151, name: "Malaysia" },
        { id: 152, name: "Maldives" },
        { id: 153, name: "Mali" },
        { id: 154, name: "Malta" },
        { id: 155, name: "Marshall Islands" },
        { id: 156, name: "Martinique" },
        { id: 157, name: "Mauritania" },
        { id: 158, name: "Mauritius" },
        { id: 159, name: "Mayotte" },
        { id: 160, name: "Mexico" },
        { id: 161, name: "Micronesia, Federated States of" },
        { id: 162, name: "Moldova, Republic of" },
        { id: 163, name: "Monaco" },
        { id: 164, name: "Mongolia" },
        { id: 165, name: "Montenegro" },
        { id: 166, name: "Montserrat" },
        { id: 167, name: "Morocco" },
        { id: 168, name: "Mozambique" },
        { id: 169, name: "Myanmar" },
        { id: 170, name: "Namibia" },
        { id: 171, name: "Nauru" },
        { id: 172, name: "Nepal" },
        { id: 173, name: "Netherlands" },
        { id: 174, name: "New Caledonia" },
        { id: 175, name: "New Zealand" },
        { id: 176, name: "Nicaragua" },
        { id: 177, name: "Niger" },
        { id: 178, name: "Nigeria" },
        { id: 179, name: "Niue" },
        { id: 180, name: "Norfolk Island" },
        { id: 181, name: "Northern Mariana Islands" },
        { id: 182, name: "Norway" },
        { id: 183, name: "Oman" },
        { id: 184, name: "Pakistan" },
        { id: 185, name: "Palau" },
        { id: 186, name: "Palestinian Territory, Occupied" },
        { id: 187, name: "Panama" },
        { id: 188, name: "Papua New Guinea" },
        { id: 189, name: "Paraguay" },
        { id: 190, name: "Peru" },
        { id: 191, name: "Philippines" },
        { id: 192, name: "Pitcairn" },
        { id: 193, name: "Poland" },
        { id: 194, name: "Portugal" },
        { id: 195, name: "Puerto Rico" },
        { id: 196, name: "Qatar" },
        { id: 197, name: "Reunion" },
        { id: 198, name: "Romania" },
        { id: 199, name: "Russian Federation" },
        { id: 200, name: "Rwanda" },
        { id: 201, name: "Saint Helena" },
        { id: 202, name: "Saint Kitts and Nevis" },
        { id: 203, name: "Saint Lucia" },
        { id: 204, name: "Saint Pierre and Miquelon" },
        { id: 205, name: "Saint Vincent and The Grenadines" },
        { id: 206, name: "Samoa" },
        { id: 207, name: "San Marino" },
        { id: 208, name: "Sao Tome and Principe" },
        { id: 209, name: "Saudi Arabia" },
        { id: 210, name: "Senegal" },
        { id: 211, name: "Serbia" },
        { id: 212, name: "Seychelles" },
        { id: 213, name: "Sierra Leone" },
        { id: 214, name: "Singapore" },
        { id: 215, name: "Slovakia" },
        { id: 216, name: "Slovenia" },
        { id: 217, name: "Solomon Islands" },
        { id: 218, name: "Somalia" },
        { id: 219, name: "South Africa" },
        { id: 220, name: "South Georgia and The South Sandwich Islands" },
        { id: 221, name: "Spain" },
        { id: 222, name: "Sri Lanka" },
        { id: 223, name: "Sudan" },
        { id: 224, name: "Suriname" },
        { id: 225, name: "Svalbard and Jan Mayen" },
        { id: 226, name: "Swaziland" },
        { id: 227, name: "Sweden" },
        { id: 228, name: "Switzerland" },
        { id: 229, name: "Syrian Arab Republic" },
        { id: 230, name: "Taiwan, Province of China" },
        { id: 231, name: "Tajikistan" },
        { id: 232, name: "Tanzania, United Republic of" },
        { id: 233, name: "Thailand" },
        { id: 234, name: "Timor-leste" },
        { id: 235, name: "Togo" },
        { id: 236, name: "Tokelau" },
        { id: 237, name: "Tonga" },
        { id: 238, name: "Trinidad and Tobago" },
        { id: 239, name: "Tunisia" },
        { id: 240, name: "Turkey" },
        { id: 241, name: "Turkmenistan" },
        { id: 242, name: "Turks and Caicos Islands" },
        { id: 243, name: "Tuvalu" },
        { id: 244, name: "Uganda" },
        { id: 245, name: "Ukraine" },
        { id: 246, name: "United Arab Emirates" },
        { id: 247, name: "United States Minor Outlying Islands" },
        { id: 248, name: "Uruguay" },
        { id: 249, name: "Uzbekistan" },
        { id: 250, name: "Vanuatu" },
        { id: 251, name: "Venezuela" },
        { id: 252, name: "Viet Nam" },
        { id: 253, name: "Virgin Islands, British" },
        { id: 254, name: "Virgin Islands, U.S." },
        { id: 255, name: "Wallis and Futuna" },
        { id: 256, name: "Western Sahara" },
        { id: 257, name: "Yemen" },
        { id: 258, name: "Zambia" },
        { id: 259, name: "Zimbabwe" }
      ]
    }
  }).
  service('educationLevelService', function() {
    return {
      educationLevels: [
        { id: 21, name: "PhD" },
        { id: 22, name: "Masters" },
        { id: 23, name: "Batchelors" },
        { id: 24, name: "Teaching Qualification/Certification" },
        { id: 25, name: "Secondary / High School" },
        { id: 26, name: "CELTA/TEFL" },
        { id: 27, name: "Other" }
      ]
    }
  }).
  service('referenceTypeService', function() {
    return {
      referenceTypes: [
        { id: 21, name: "Teacher (for most teachers)" },
        { id: 22, name: "Senior Administrator (for positions of leadership)" },
        { id: 23, name: "Middle Manager (Curriculum)" },
        { id: 24, name: "Middle Manager (Pastoral)" },
        { id: 25, name: "IB Coordinator" }
      ]
    }
  }).
  service('refereePositionService', function() {
    return {
      refereePositions: [
        { id: 21, name: "Head of School" },
        { id: 22, name: "Deputy Head/Vice Principal" },
        { id: 23, name: "Governor/Board Member" },
        { id: 24, name: "Head of Department" },
        { id: 25, name: "Head of Primary/Elementary" },
        { id: 26, name: "Head of Middle School" },
        { id: 27, name: "Head of Secondary/High School" },
        { id: 28, name: "IB Coordinator" },
        { id: 29, name: "Other Supervisor" }
      ]
    }
  }).
  service('computerSkillService', function() {
    return {
      computerSkills: [
        { id: 21, name: "Word" },
        { id: 22, name: "Excel" },
        { id: 23, name: "Powerpoint" },
        { id: 24, name: "Publisher" },
        { id: 25, name: "Interactive whiteboards" },
        { id: 26, name: "Outlook" },
        { id: 27, name: "MAC" },
        { id: 28, name: "GDCs" },
        { id: 29, name: "SIMS" },
        { id: 30, name: "Moodle" },
        { id: 31, name: "VLEs" },
        { id: 32, name: "Web development" },
        { id: 33, name: "Twitter" },
        { id: 34, name: "Social media" },
        { id: 35, name: "Photoshop" }
      ]
    }
  }).
  service('teachingSkillService', function() {
    return {
      teachingSkills: [
        { id: 21, name: "Student centred learning" },
        { id: 22, name: "Inquiry based learning" },
        { id: 23, name: "Behaviour management" },
        { id: 24, name: "Different learning styles" },
        { id: 25, name: "Myers Briggs" },
        { id: 26, name: "Differentiation" },
        { id: 27, name: "Project management" },
        { id: 28, name: "Duke of Edinburgh" },
        { id: 29, name: "Model UN" },
        { id: 30, name: "CCF" },
        { id: 31, name: "Teacher training" },
        { id: 32, name: "Teacher mentoring" },
        { id: 33, name: "Personal tutoring" },
        { id: 34, name: "Young Enterprise" },
        { id: 35, name: "CELTA/TEFL" },
        { id: 36, name: "TOK" }
      ]
    }
  }).
  service('languageService', function() {
    return {
      languages: [
        { id: 21, name: "English" },
        { id: 22, name: "Spanish" },
        { id: 23, name: "French" },
        { id: 24, name: "German" },
        { id: 25, name: "Italian" },
        { id: 26, name: "Portuguese" },
        { id: 27, name: "Japanese" },
        { id: 28, name: "Chinese" },
        { id: 29, name: "Arabic" },
        { id: 30, name: "Other" }
      ]
    }
  }).
  service('preferenceLevelService', function() {
    return {
      preferenceLevels: [
        { id: 21, name: "Essential" },
        { id: 22, name: "Important" },
        { id: 23, name: "Preferred" },
        { id: 24, name: "Not important" },
        { id: 25, name: "Not applicable" }
      ]
    }
  }).
  service('locationService', function() {
    return {
      locations: [
        { id: 21, name: "Africa" },
        { id: 22, name: "Central America" },
        { id: 23, name: "North America" },
        { id: 24, name: "South America" },
        { id: 25, name: "Asia" },
        { id: 26, name: "Middle East" }
      ]
    }
  }).
  service('curriculumService', function() {
    return {
      curricula: [
        { id: 21, name: "International Baccalaureate (DP)" },
        { id: 22, name: "International Baccalaureate (MYP)" },
        { id: 23, name: "International Baccalaureate (PYP)" },
        { id: 24, name: "A-Levels" },
        { id: 25, name: "IGCSE" },
        { id: 26, name: "SAT Reasoning Test" },
        { id: 27, name: "American College Testing" },
        { id: 28, name: "French Baccalaureate" },
        { id: 29, name: "German Abitur" },
        { id: 30, name: "Titulo de Bachiller" },
        { id: 31, name: "Australian SSCE" },
        { id: 32, name: "Indian School Certificate" },
        { id: 33, name: "Advanced Placement" },
        { id: 34, name: "Early Years Foundation Stage (EYFS)" },
        { id: 35, name: "International Primary Curriculum (IPC)" },
        { id: 36, name: "British National Curriculum" }
      ]
    }
  }).
  service('ageLevelService', function() {
    return {
      ageLevels: [
        { id: 21, name: "Pre-School/KG" },
        { id: 22, name: "Elementary/Primary" },
        { id: 23, name: "Middle School" },
        { id: 24, name: "Secondary" },
        { id: 25, name: "High School" }
      ]
    }
  }).
  service('numberOfDependentChildrenService', function() {
    return {
      numberOfDependentChildren: [
        { id: 0, name: "0" },
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: '5+', name: "5+" }
      ]
    }
  }).
  service('birthYearService', function() {
    return {
      birthYears : [
        { id: 1940, name: "1940" },
        { id: 1941, name: "1941" },
        { id: 1942, name: "1942" },
        { id: 1943, name: "1943" },
        { id: 1944, name: "1944" },
        { id: 1945, name: "1945" },
        { id: 1946, name: "1946" },
        { id: 1947, name: "1947" },
        { id: 1948, name: "1948" },
        { id: 1949, name: "1949" },
        { id: 1950, name: "1950" },
        { id: 1951, name: "1951" },
        { id: 1952, name: "1952" },
        { id: 1953, name: "1953" },
        { id: 1954, name: "1954" },
        { id: 1955, name: "1955" },
        { id: 1956, name: "1956" },
        { id: 1957, name: "1957" },
        { id: 1958, name: "1958" },
        { id: 1959, name: "1959" },
        { id: 1960, name: "1960" },
        { id: 1961, name: "1961" },
        { id: 1962, name: "1962" },
        { id: 1963, name: "1963" },
        { id: 1964, name: "1964" },
        { id: 1965, name: "1965" },
        { id: 1966, name: "1966" },
        { id: 1967, name: "1967" },
        { id: 1968, name: "1968" },
        { id: 1969, name: "1969" },
        { id: 1970, name: "1970" },
        { id: 1971, name: "1971" },
        { id: 1972, name: "1972" },
        { id: 1973, name: "1973" },
        { id: 1974, name: "1974" },
        { id: 1975, name: "1975" },
        { id: 1976, name: "1976" },
        { id: 1977, name: "1977" },
        { id: 1978, name: "1978" },
        { id: 1979, name: "1979" },
        { id: 1980, name: "1980" },
        { id: 1981, name: "1981" },
        { id: 1982, name: "1982" },
        { id: 1983, name: "1983" },
        { id: 1984, name: "1984" },
        { id: 1985, name: "1985" },
        { id: 1986, name: "1986" },
        { id: 1987, name: "1987" },
        { id: 1988, name: "1988" },
        { id: 1989, name: "1989" },
        { id: 1990, name: "1990" },
        { id: 1991, name: "1991" },
        { id: 1992, name: "1992" },
        { id: 1993, name: "1993" },
        { id: 1994, name: "1994" }
      ]
    }
  }).
  service('maritalStatusService', function() {
    return {
      maritalStatuses: [
        { id: 21, name: "Single" },
        { id: 22, name: "Married" },
        { id: 23, name: "Living with Partner" },
        { id: 24, name: "Other" }
      ]
    }
  });