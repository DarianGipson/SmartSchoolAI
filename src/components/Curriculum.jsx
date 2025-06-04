<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
  {grades.map((grade, idx) => (
    <button
      key={grade}
      className={`rounded-2xl shadow-md border-2 font-bold text-2xl py-8 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue
        ${idx % 3 === 0 ? 'bg-smartSchool-blue/10 border-smartSchool-blue text-smartSchool-blue hover:bg-smartSchool-blue/20' :
          idx % 3 === 1 ? 'bg-smartSchool-yellow/10 border-smartSchool-yellow text-smartSchool-yellow hover:bg-smartSchool-yellow/20' :
          'bg-smartSchool-red/10 border-smartSchool-red text-smartSchool-red hover:bg-smartSchool-red/20'}
        hover:scale-105`}
      onClick={() => handleSelectGrade(grade)}
    >
      {grade}
    </button>
  ))}
</div>