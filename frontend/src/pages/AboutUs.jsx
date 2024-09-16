import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { Link } from "react-router-dom";
  import { RiGithubFill } from "react-icons/ri";
  const contributors = [
    {
      name: 'Himanshu Rai',
      imageUrl: '../../assets/profile.jpg',
      github: 'https://github.com/HIMANSHURAI2004',
    },
    {
      name: 'Giriraj Bhatt',
      imageUrl: '../../assets/profile.jpg',
      github: 'https://github.com/Girirajbhatt',
    }
  ];
  import bg from "../../assets/footer.png";
  const AboutUs = () => {
    return (
      <div className=" w-full space-y-5">
      <div className="lg:mb-20">

        {/* Hero Section */}
        <div
        style={{ "--image-url": `url(${bg})` }}
        className="bg-[image:var(--image-url)] w-full pb-10 text-white py-16 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Meet Our Awesome Team</h1>
          <p className="text-lg">
            We are a passionate group of developers who strive to create amazing user experiences and powerful functionalities.
          </p>
        </div>
  
        {/* About Us Section */}
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-3xl text-center font-bold mb-6">About Us</h2>
          <p className="text-center max-w-2xl mx-auto mb-8">
            Our team combines expertise from different areas, including front-end development, back-end development, and user interface design. We build experiences that delight users and provide powerful solutions.
          </p>
  
          <div className="flex flex-wrap justify-center gap-10">
            {contributors.map((contributor, index) => (
              <Card key={index} className="w-[180px] text-center shadow-md transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-200">
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="text-xl font-semibold">{contributor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Link to={contributor.github}>
                      <RiGithubFill className="w-8 h-8 text-gray-600 hover:text-black cursor-pointer" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
  
        {/* Testimonials Section */}
        <div 
        style={{ "--image-url": `url(${bg})` }}
        className="bg-[image:var(--image-url)] w-full py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl text-white font-bold mb-6">What Our Clients Say</h2>
            <p className="text-lg text-white mb-8">
              We pride ourselves on delivering high-quality products that meet our clients' needs.
            </p>
  
            <div className="flex flex-wrap justify-center gap-8">
              <Card className="max-w-sm bg-white shadow-lg text-center p-4">
                <p className="text-sm mb-4">
                  "The team was amazing to work with! They delivered everything we asked for and more. Highly recommended!"
                </p>
                <p className="text-sm text-muted-foreground">- John Doe, CEO of ExampleCorp</p>
              </Card>
  
              <Card className="max-w-sm bg-white shadow-lg text-center p-4">
                <p className="text-sm mb-4">
                  "Great communication and technical expertise. The project was a success thanks to their hard work."
                </p>
                <p className="text-sm text-muted-foreground">- Sarah Lee, CTO of Tech Innovations</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;
  
