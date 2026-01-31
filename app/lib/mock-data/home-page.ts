import { PageField } from '@/types/common'

export const initialContent: PageField[] = [
  // Hero Section
  {
    id: 'hero_heading',
    section: 'hero',
    label: 'Hero Heading',
    value: 'Great Futures Start Here',
    type: 'text'
  },
  {
    id: 'hero_bodyText',
    section: 'hero',
    label: 'Hero Body Text',
    value: 'Inspiring and enabling all young people to realize their full potential',
    type: 'textarea'
  },
  {
    id: 'hero_button1Text',
    section: 'hero',
    label: 'Button 1 Text',
    value: 'Donate',
    type: 'text'
  },
  {
    id: 'hero_button1Link',
    section: 'hero',
    label: 'Button 1 Link',
    value: '/donate',
    type: 'text'
  },
  {
    id: 'hero_button2Text',
    section: 'hero',
    label: 'Button 2 Text',
    value: 'Parent Portal',
    type: 'text'
  },
  {
    id: 'hero_button2Link',
    section: 'hero',
    label: 'Button 2 Link',
    value: 'https://parentportal.bgcl.org/',
    type: 'text'
  },

  // Modal Section
  {
    id: 'modal_heading',
    section: 'modal',
    label: 'Modal Heading',
    value: 'Summer Registration Opens February 2nd! ',
    type: 'text'
  },
  {
    id: 'modal_subheading',
    section: 'modal',
    label: 'Modal Subheading',
    value: 'Enroll your child now in our quality summer programs designed to inspire growth, learning, and community.',
    type: 'textarea'
  },
  {
    id: 'modal_button1Text',
    section: 'modal',
    label: 'Button 1 Text',
    value: 'Save The Date! ',
    type: 'text'
  },
  {
    id: 'modal_button1Link',
    section: 'modal',
    label: 'Button 1 Link',
    value: 'https://parentportal.bgcl.org/',
    type: 'text'
  },
  {
    id: 'modal_button2Text',
    section: 'modal',
    label: 'Button 2 Text',
    value: 'Enrollment Opens at 12pm ',
    type: 'text'
  },
  {
    id: 'modal_toggleModal',
    section: 'modal',
    label: 'Show Modal',
    value: 'true',
    type: 'boolean'
  },

  // Facility Section
  {
    id: 'facility_heading1',
    section: 'facility',
    label: 'Facility Heading 1',
    value: 'Building',
    type: 'text'
  },
  {
    id: 'facility_heading2',
    section: 'facility',
    label: 'Facility Heading 2',
    value: 'the Future',
    type: 'text'
  },
  {
    id: 'facility_subheading',
    section: 'facility',
    label: 'Facility Subheading',
    value: 'Our Transformation',
    type: 'text'
  },
  {
    id: 'facility_paragraph1',
    section: 'facility',
    label: 'Facility Paragraph 1',
    value:
      'The Boys & Girls Club of Lynn recently underwent a $6.4 million dollar renovation in 2020. With the support of our many donors, we were able to complete a big portion of our building renovation. We are proud to offer the following new additions to our facility: Dance Studio, STEAM Lab, Planet Fitness Gym, Teen Center, Gaming Room, as well as a Technology Center.',
    type: 'textarea'
  },
  {
    id: 'facility_paragraph2',
    section: 'facility',
    label: 'Facility Paragraph 2',
    value:
      'The club also has a new and improved lobby area, Board Room, multiple office space for our staff, bathrooms, registration areas and more! Our Kids Club and Afterschool program spaces have been fully renovated as well! At our Kids Club, we offer 3 dedicated classrooms, a huge open play and activity area along with a tower garden for our little members to explore and delve into the art of gardening.',
    type: 'textarea'
  },
  {
    id: 'facility_paragraph3',
    section: 'facility',
    label: 'Facility Paragraph 3',
    value:
      'Our newly enhanced After School Drop In Center is equipped with a dedicated Teen area as well as the aforementioned STEAM Lab, Gym, Dance Studio, Gaming area and also a Tower Garden for our older members to test out their gardening skills! Over the next 5-6 years, we will be heading into Phase 2 of our renovations. We are looking forward to offering a Culinary program, Preschool, new Gym, and more! ',
    type: 'textarea'
  },

  // Programs Section
  {
    id: 'programs_heading1',
    section: 'programs',
    label: 'Programs Heading 1',
    value: 'Building',
    type: 'text'
  },
  {
    id: 'programs_heading2',
    section: 'programs',
    label: 'Programs Heading 2',
    value: 'Skills for Tomorrow',
    type: 'text'
  },
  {
    id: 'programs_subheading',
    section: 'programs',
    label: 'Programs Subheading',
    value: 'Our programs',
    type: 'text'
  }
]
