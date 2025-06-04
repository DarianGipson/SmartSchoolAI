import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, BookOpenText, PencilLine, FlaskConical, Landmark, Palette, Sparkles, Code2, 
  Target, Award, PlayCircle, Smile 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const subjects = [
  { name: "Math", icon: Calculator, color: "text-smartSchool-blue", gradeLevels: ["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
  { name: "Reading", icon: BookOpenText, color: "text-smartSchool-red", gradeLevels: ["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
  { name: "Writing", icon: PencilLine, color: "text-green-500", gradeLevels: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
  { name: "Science", icon: FlaskConical, color: "text-smartSchool-yellow", gradeLevels: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
  { name: "Social Studies", icon: Landmark, color: "text-purple-500", gradeLevels: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
  { name: "Art", icon: Palette, color: "text-orange-500", gradeLevels: ["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8"] },
  { name: "Bible", icon: Sparkles, color: "text-sky-500", gradeLevels: ["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], optional: true },
  { name: "Coding", icon: Code2, color: "text-gray-700", gradeLevels: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
];

const HomePage = () => {
  const { user } = useAuth();
  const studentName = user && user.role === 'student' ? user.name : "Explorer";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div className="space-y-12 animate-fade-in" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.section variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-smartSchool-blue animate-fade-in">
          Welcome, {studentName}!
        </h1>
        <p className="text-xl text-center text-gray-600">Ready for a new day of learning adventures?</p>
      </motion.section>

      {!user || user.role !== 'parent' ? (
        <>
          <motion.section variants={itemVariants} className="p-6 bg-white rounded-2xl shadow-xl border border-smartSchool-blue/30">
            <div className="flex items-center space-x-3 mb-4">
              <Target size={32} className="text-smartSchool-red" />
              <h2 className="text-3xl font-semibold">Daily Learning Plan</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Here's what's on your plate today. Let's make it awesome!
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-2">
              <li>Complete 1 Math lesson on Addition.</li>
              <li>Read a story about Brave Knights.</li>
              <li>Explore the wonders of Plant Life in Science.</li>
            </ul>
            <Button size="lg" className="mt-6 bg-smartSchool-red hover:bg-smartSchool-red/90 text-white font-semibold py-3 px-8 text-lg rounded-xl">
              <PlayCircle size={24} className="mr-2" />
              Start Today's Plan
            </Button>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <Award size={32} className="text-smartSchool-yellow hover:animate-wiggle" />
              <h2 className="text-3xl font-semibold">Your Subjects</h2>
            </div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {subjects.map((subject) => (
                <motion.div key={subject.name} variants={itemVariants}>
                  <Card className="hover:shadow-2xl transition-shadow duration-300 ease-in-out border-2 border-transparent hover:border-smartSchool-blue transform hover:-translate-y-1 rounded-2xl hover:animate-pop-on-hover cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                      <CardTitle className="text-xl font-poppins">{subject.name}</CardTitle>
                      <subject.icon size={32} className={`${subject.color} hover:animate-wiggle`} />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-gray-500 mb-3">Explore lessons, quizzes, and fun activities in {subject.name}.</p>
                      <Button size="default" className="w-full font-semibold py-2 text-base rounded-lg">
                        <PlayCircle size={18} className="mr-2" />
                        Start {subject.name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section variants={itemVariants} className="text-center mt-12">
            <h2 className="text-2xl font-semibold mb-4">Ready to Dive In?</h2>
            <Button size="lg" className="bg-smartSchool-blue hover:bg-blue-700 text-white font-bold py-4 px-10 text-xl shadow-lg transform hover:scale-105 transition-transform duration-200 rounded-xl">
              Let's Learn Something New!
            </Button>
          </motion.section>
        </>
      ) : (
        <motion.section variants={itemVariants} className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <Smile size={64} className="mx-auto text-smartSchool-yellow mb-4" />
          <h2 className="text-3xl font-semibold mb-3">Welcome, Parent!</h2>
          <p className="text-lg text-gray-600 mb-6">
            This is the student dashboard. Access your parent tools from the navigation bar above or by clicking below.
          </p>
          <Link to="/parent-dashboard">
            <Button size="lg" className="bg-smartSchool-blue hover:bg-smartSchool-blue/90 text-white font-semibold py-3 px-8 text-lg rounded-xl">
              Go to Parent Dashboard
            </Button>
          </Link>
        </motion.section>
      )}

      {/* Floating helper button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button className="bg-smartSchool-blue text-white rounded-full shadow-lg p-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-float relative">
          <span className="sr-only">Need help?</span>
          <Sparkles className="w-6 h-6 animate-wiggle group-hover:animate-wiggle" />
        </button>
        <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-white text-gray-700 px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          Need help? Click here for tips!
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;