import React from 'react';
import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl max-auto p-3 text-center'>
        <div className=''>
          <h1 className='text-3xl font-semibold text-center my-7'>About Me</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>I am Mihir Sachin Vaidya, a dedicated software developer with a strong foundation in technical programming and a passion for creating innovative solutions. I hold a Master’s degree in Computer Science from Indiana University Bloomington and a Bachelor’s degree in Computer Engineering from the University of Mumbai. My academic journey has equipped me with a comprehensive understanding of computer science principles and practical skills in various programming languages and frameworks.</p>
            <p>Professionally, I have accumulated over a year of experience in technical programming roles. During my 8-month internship at Schneider Electric’s Innovation Lab, I worked extensively on developing machine learning models, performing data analysis, and building ETL pipelines using Azure Databricks and Synapse Analytics. This role allowed me to handle large-scale data sets and collaborate with cross-functional teams to optimize processes and improve operational efficiency. My efforts in creating analytics and business intelligence dashboards significantly contributed to better decision-making and enhanced plant yield for our clients.</p>
            <p>In addition to my experience in data analysis and machine learning, I have a robust background in web development and full-stack development. As a web development intern in India, I deployed websites using AWS EC2 and ELB, ensuring high reliability and fault tolerance. Currently, I am working as a full-stack developer under a university professor, where I have successfully orchestrated CI/CD pipelines using Jenkins, Ansible, Docker, and Kubernetes. My work focuses on automating development, building, and deployment processes, which has greatly improved efficiency and scalability. I am committed to leveraging digital transformation to solve complex problems and enhance the everyday lives of individuals and businesses.</p>
          </div>
        </div>
      </div>
      <CallToAction/>
    </div>
  )
}
