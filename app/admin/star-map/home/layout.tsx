import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'
import HomePage from './page'

export default async function HomeLayout() {
  const data = await getPageBySlug('home')
  return (
    <HomePage
      data={
        data || {
          slug: 'home',
          content: {
            cta: {
              heading: 'Ready to Make a Difference!!',
              bodyText: "Join our community and help shape the future of Lynn's youth",
              buttonLink: '/donate',
              buttonText: 'Get Involved'
            },
            faq: {
              answer1: 'Contact us at...',
              answer2: 'We offer...',
              answer3: 'Most programs are...',
              heading: 'Frequently Asked Questions',
              question1: 'How do I enroll my child?',
              question2: 'What programs are available?',
              question3: 'What are the costs?'
            },
            about: {
              stats: {
                yearsServing: '35+',
                membersServed: '1,200+',
                programsOffered: '15+'
              },
              heading: 'Our Mission',
              bodyText:
                'To inspire and enable all young people, especially those that need us the most, to realize their full potential as productive responsible and caring citizens.'
            },
            facility: {
              heading: 'Our New Facility',
              description:
                'The Boys & Girls Club of Lynn recently underwent a $6.4 million dollar renovation in 2020. With the support of our many donors, we were able to complete a big portion of our building renovation. We are proud to offer the following new additions to our facility: Dance Studio, STEAM Lab, Planet Fitness Gym, Teen Center, Gaming Room, as well as a Technology Center.',
              descriptionContinued:
                'The club also has a new and improved lobby area, Board Room, multiple office space for our staff, bathrooms, registration areas and more! Our Kids Club and Afterschool program spaces have been fully renovated as well! At our Kids Club, we offer 3 dedicated classrooms, a huge open play and activity area along with a tower garden for our little members to explore and delve into the art of gardening. Our newly enhanced After School Drop In Center is equipped with a dedicated Teen area as well as the aforementioned STEAM Lab, Gym, Dance Studio, Gaming area and also a Tower Garden for our older members to test out their gardening skills! Over the next 3-4 years, we will be heading into Phase 2 of our renovations. We are looking forward to offering a Culinary program and a Rooftop garden to name a few of our proposed upgrades. Please click on the images below to explore some of our latest and greatest updates to the Boys & Girls Club of Lynn!'
            },
            programs: {
              heading: 'Our Programs',
              subheading: 'Discover opportunities for growth and learning'
            },
            volunteer: {
              heading: 'Interested in Becoming a Volunteer?',
              buttonLink: '/contact',
              buttonText: 'Learn More',
              description:
                "At the Boys & Girls Club of Lynn, we understand where every kid is coming from and where they can go – and have trained youth development professionals who can help them get there. If you are over 18 with a passion for our community's youth, we invite you to join us and help build great futures for the kids we serve on a daily basis. Please note that all Boys & Girls Club volunteers must undergo a background check."
            },
            newsletter: {
              heading: 'Stay Updated',
              buttonText: 'Subscribe',
              subheading: 'Get news and updates delivered to your inbox',
              placeholderText: 'Enter your email'
            },
            testimonials: {
              heading: 'What People Are Saying',
              subheading: 'Stories from our community',
              testimonial1:
                'This company is mission driven in providing a safe environment where kids can grow in their social development skills while having fun. Kids can be kids in this environment and leave the troubles of home life out the door. The crew is absolutely amazing and understanding people.',
              testimonial2:
                'My son plays basketball here...the two young girls that greeted us at the door were so polite. Place is very clean and the kids seem well behaved. Lots of off street parking.',
              testimonial1Author: 'Jogan Infotech',
              testimonial2Author: 'Chris Mass'
            }
          }
        }
      }
    />
  )
}
