import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'campusone-data-v1'
const navItems = [
  'Overview',
  'Academic Hub',
  'Opportunity Explorer',
  'Campus Community',
  'Academic Insights',
  'AI Study Assistant',
]

const priorityOptions = ['Low', 'Medium', 'High']
const assignmentStatuses = ['Not Started', 'In Progress', 'Completed']
const opportunityStatuses = ['Interested', 'Planning to Apply', 'Applied', 'Completed']
const communityCategories = ['All', 'Question', 'Idea', 'Study Group', 'Teammate Request']

const sampleData = {
  subjects: [
    { id: 'sub-1', name: 'Algorithms', code: 'CS201', description: 'Complexity and graph traversal.' },
    { id: 'sub-2', name: 'Human Rights', code: 'POL220', description: 'Theory and policy analysis.' },
    { id: 'sub-3', name: 'Data Journalism', code: 'JRN310', description: 'Researching with stories and data.' },
  ],
  assignments: [
    {
      id: 'a-1',
      title: 'Graph traversal memo',
      description: 'Explain BFS/DFS trade-offs in a short technical brief.',
      subject: 'Algorithms',
      dueDate: '2026-11-02',
      priority: 'High',
      status: 'In Progress',
    },
    {
      id: 'a-2',
      title: 'Case study review',
      description: 'Compare two international rights frameworks.',
      subject: 'Human Rights',
      dueDate: '2026-11-05',
      priority: 'Medium',
      status: 'Not Started',
    },
    {
      id: 'a-3',
      title: 'Data visualisation brief',
      description: 'Draft an infographic using a public dataset.',
      subject: 'Data Journalism',
      dueDate: '2026-10-30',
      priority: 'High',
      status: 'Completed',
    },
  ],
  timetable: [
    { id: 't-1', subject: 'Algorithms', day: 'Monday', startTime: '09:00', endTime: '10:30', location: 'Lab 2B' },
    { id: 't-2', subject: 'Human Rights', day: 'Tuesday', startTime: '11:00', endTime: '12:30', location: 'Room 4A' },
    { id: 't-3', subject: 'Data Journalism', day: 'Wednesday', startTime: '14:00', endTime: '15:30', location: 'Media Studio' },
  ],
  exams: [
    { id: 'e-1', subject: 'Algorithms', date: '2026-11-18', notes: 'Focus on proof techniques and complexity.' },
    { id: 'e-2', subject: 'Human Rights', date: '2026-11-20', notes: 'Review three case studies and legal terms.' },
  ],
  attendance: [
    { id: 'att-1', subject: 'Algorithms', classesConducted: 15, classesAttended: 13 },
    { id: 'att-2', subject: 'Human Rights', classesConducted: 12, classesAttended: 9 },
    { id: 'att-3', subject: 'Data Journalism', classesConducted: 10, classesAttended: 10 },
  ],
  opportunities: [
    {
      id: 'o-1',
      title: 'Product Design Internship',
      organisation: 'Northstar Labs',
      category: 'Internships and jobs',
      description: 'UX research and prototyping internship for design students.',
      deadline: '2026-11-12',
      source: 'Sample listing - not verified live',
      saved: true,
      status: 'Planning to Apply',
      eligibility: 'Open to 2nd and 3rd year students',
    },
    {
      id: 'o-2',
      title: 'Climate Hackathon Sprint',
      organisation: 'SustainHub',
      category: 'Hackathons and competitions',
      description: 'Prototype a civic data solution in 48 hours.',
      deadline: '2026-11-15',
      source: 'Sample listing - not verified live',
      saved: false,
      status: 'Interested',
      eligibility: 'Teams of 3 to 5 students',
    },
    {
      id: 'o-3',
      title: 'Education Scholarship',
      organisation: 'The Future Fellows Foundation',
      category: 'Scholarships',
      description: 'Need-based support for students with strong community impact.',
      deadline: '2026-12-01',
      source: 'Sample listing - not verified live',
      saved: true,
      status: 'Applied',
      eligibility: 'Must be in good academic standing',
    },
  ],
  posts: [
    {
      id: 'p-1',
      category: 'Question',
      title: 'Best way to revise for proofs?',
      content: 'I am struggling with theoretical proof questions in Algorithms. Does anyone have a revision plan?',
      author: 'Aarav',
      time: '2 hours ago',
    },
    {
      id: 'p-2',
      category: 'Idea',
      title: 'Campus climate data project',
      content: 'Looking for teammates who want to build a dashboard on local weather trends and student mobility.',
      author: 'Maya',
      time: 'Yesterday',
    },
  ],
  groups: [
    { id: 'g-1', name: 'Algorithms Sprint Club', category: 'Study Group', members: ['You', 'Nia', 'Leo'], description: 'Review problem sets and timed drills every Friday.' },
    { id: 'g-2', name: 'Podcast Lab', category: 'Project', members: ['You', 'Riya'], description: 'Collect stories and produce short audio features.' },
  ],
  studyLogs: [
    { date: '2026-10-23', minutes: 35 },
    { date: '2026-10-24', minutes: 70 },
    { date: '2026-10-25', minutes: 110 },
    { date: '2026-10-26', minutes: 90 },
    { date: '2026-10-27', minutes: 120 },
    { date: '2026-10-28', minutes: 95 },
  ],
  attendanceThreshold: 75,
}

const initialSubjectForm = { name: '', code: '', description: '' }
const initialAssignmentForm = {
  title: '',
  description: '',
  subject: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Not Started',
}
const initialTimetableForm = {
  subject: '',
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
}
const initialExamForm = { subject: '', date: '', notes: '' }
const initialAttendanceForm = { subject: '', classesConducted: '', classesAttended: '' }
const initialOpportunityForm = {
  title: '',
  organisation: '',
  category: 'Internships and jobs',
  description: '',
  deadline: '',
  eligibility: '',
  source: '',
}
const initialPostForm = { title: '', category: 'Question', content: '', author: 'You' }
const initialGroupForm = { name: '', category: 'Study Group', description: '', members: 'You' }

function formatDate(dateString) {
  if (!dateString) return 'No date'
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return sampleData

    const parsed = JSON.parse(saved)
    const uniqueSubjects = [...(parsed.subjects || [])].filter((subject, index, all) => {
      const normalized = `${subject.name}-${subject.code}`.toLowerCase()
      return all.findIndex((item) => `${item.name}-${item.code}`.toLowerCase() === normalized) === index
    })

    return {
      ...parsed,
      subjects: uniqueSubjects,
    }
  })
  const [activeTab, setActiveTab] = useState('Overview')
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm)
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm)
  const [timetableForm, setTimetableForm] = useState(initialTimetableForm)
  const [examForm, setExamForm] = useState(initialExamForm)
  const [attendanceForm, setAttendanceForm] = useState(initialAttendanceForm)
  const [opportunityForm, setOpportunityForm] = useState(initialOpportunityForm)
  const [postForm, setPostForm] = useState(initialPostForm)
  const [groupForm, setGroupForm] = useState(initialGroupForm)
  const [timingError, setTimingError] = useState('')
  const [assignmentSearch, setAssignmentSearch] = useState('')
  const [assignmentFilter, setAssignmentFilter] = useState('All')
  const [opportunityQuery, setOpportunityQuery] = useState('')
  const [opportunityFilter, setOpportunityFilter] = useState('All')
  const [communityQuery, setCommunityQuery] = useState('')
  const [communityFilter, setCommunityFilter] = useState('All')
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      message: 'Welcome back. I can plan your study schedule, draft practice questions, or explain a concept in plain language.',
    },
  ])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const [todayInfo] = useState(() => {
    const now = new Date()
    return {
      label: now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      iso: now.toISOString().slice(0, 10),
      dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
    }
  })

  const assignmentInsights = useMemo(() => {
    const totalAssignments = data.assignments.length
    const completedAssignments = data.assignments.filter((item) => item.status === 'Completed').length
    const completionRate = totalAssignments ? Math.round((completedAssignments / totalAssignments) * 100) : 0
    const upcoming = data.assignments
      .filter((item) => item.dueDate >= todayInfo.iso)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    const overdue = data.assignments.filter((item) => item.dueDate < todayInfo.iso && item.status !== 'Completed')

    return { totalAssignments, completedAssignments, completionRate, upcoming, overdue }
  }, [data.assignments, todayInfo.iso])

  const attendanceInsights = useMemo(() => {
    const records = data.attendance
    const averageAttendance = records.length
      ? Math.round(
          records.reduce((sum, item) => {
            const percent = item.classesConducted ? (item.classesAttended / item.classesConducted) * 100 : 0
            return sum + percent
          }, 0) / records.length,
        )
      : 0
    const low = records.filter((item) => {
      const percent = item.classesConducted ? (item.classesAttended / item.classesConducted) * 100 : 0
      return percent < data.attendanceThreshold
    })

    return { averageAttendance, low }
  }, [data.attendance, data.attendanceThreshold])

  const subjectSummary = useMemo(() => {
    return data.subjects.map((subject) => {
      const list = data.assignments.filter((item) => item.subject === subject.name)
      const completed = list.filter((item) => item.status === 'Completed').length
      const percentage = list.length ? Math.round((completed / list.length) * 100) : 0
      return { name: subject.name, value: percentage }
    })
  }, [data.assignments, data.subjects])

  const filteredAssignments = useMemo(() => {
    return [...data.assignments]
      .filter((assignment) => {
        const matchesSearch = assignment.title.toLowerCase().includes(assignmentSearch.toLowerCase())
        const matchesFilter = assignmentFilter === 'All' ? true : assignment.subject === assignmentFilter
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        const dueDifference = new Date(a.dueDate) - new Date(b.dueDate)
        if (dueDifference !== 0) return dueDifference
        return a.title.localeCompare(b.title)
      })
  }, [assignmentFilter, assignmentSearch, data.assignments])

  const todaysClasses = useMemo(() => {
    return data.timetable.filter((item) => item.day === todayInfo.dayName)
  }, [data.timetable, todayInfo.dayName])

  const filteredOpportunities = useMemo(() => {
    return [...data.opportunities]
      .filter((item) => {
        const matchesSearch = `${item.title} ${item.description} ${item.organisation}`.toLowerCase().includes(opportunityQuery.toLowerCase())
        const matchesFilter = opportunityFilter === 'All' ? true : item.category === opportunityFilter
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  }, [data.opportunities, opportunityFilter, opportunityQuery])

  const filteredPosts = useMemo(() => {
    return data.posts.filter((post) => {
      const matchesQuery = `${post.title} ${post.content}`.toLowerCase().includes(communityQuery.toLowerCase())
      const matchesFilter = communityFilter === 'All' ? true : post.category === communityFilter
      return matchesQuery && matchesFilter
    })
  }, [communityFilter, communityQuery, data.posts])

  const upcomingExams = [...data.exams].sort((a, b) => new Date(a.date) - new Date(b.date))

  const addSubject = (event) => {
    event.preventDefault()
    const name = subjectForm.name.trim()
    const code = subjectForm.code.trim().toUpperCase()
    if (!name || !code) return

    const duplicateSubject = data.subjects.some((subject) => {
      const sameName = subject.name.toLowerCase() === name.toLowerCase()
      const sameCode = subject.code.toLowerCase() === code.toLowerCase()
      return sameName || sameCode
    })

    if (duplicateSubject) {
      return
    }

    setData((current) => ({
      ...current,
      subjects: [
        ...current.subjects,
        {
          id: `sub-${Date.now()}`,
          name,
          code,
          description: subjectForm.description.trim(),
        },
      ],
    }))
    setSubjectForm(initialSubjectForm)
  }

  const deleteSubject = (subjectId) => {
    const target = data.subjects.find((subject) => subject.id === subjectId)
    if (!target) return

    setData((current) => ({
      ...current,
      subjects: current.subjects.filter((subject) => subject.id !== subjectId),
      assignments: current.assignments.map((assignment) =>
        assignment.subject === target.name
          ? { ...assignment, subject: current.subjects[0]?.name || '' }
          : assignment,
      ),
      timetable: current.timetable.map((item) =>
        item.subject === target.name ? { ...item, subject: current.subjects[0]?.name || '' } : item,
      ),
      exams: current.exams.map((item) =>
        item.subject === target.name ? { ...item, subject: current.subjects[0]?.name || '' } : item,
      ),
      attendance: current.attendance.map((item) =>
        item.subject === target.name ? { ...item, subject: current.subjects[0]?.name || '' } : item,
      ),
    }))
  }

  const addAssignment = (event) => {
    event.preventDefault()
    if (!assignmentForm.title.trim() || !assignmentForm.subject || !assignmentForm.dueDate) return

    setData((current) => ({
      ...current,
      assignments: [
        ...current.assignments,
        {
          id: `a-${Date.now()}`,
          title: assignmentForm.title.trim(),
          description: assignmentForm.description.trim(),
          subject: assignmentForm.subject,
          dueDate: assignmentForm.dueDate,
          priority: assignmentForm.priority,
          status: assignmentForm.status,
        },
      ],
    }))
    setAssignmentForm(initialAssignmentForm)
  }

  const updateAssignmentStatus = (assignmentId, nextStatus) => {
    setData((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, status: nextStatus } : assignment,
      ),
    }))
  }

  const deleteAssignment = (assignmentId) => {
    setData((current) => ({
      ...current,
      assignments: current.assignments.filter((item) => item.id !== assignmentId),
    }))
  }

  const addTimetableItem = (event) => {
    event.preventDefault()
    if (!timetableForm.subject || !timetableForm.location.trim()) return

    const startMinutes = timeToMinutes(timetableForm.startTime)
    const endMinutes = timeToMinutes(timetableForm.endTime)
    if (endMinutes <= startMinutes) {
      setTimingError('End time must be later than the start time.')
      return
    }

    const overlaps = data.timetable.some((entry) => {
      if (entry.day !== timetableForm.day || entry.subject === timetableForm.subject) return false
      const existingStart = timeToMinutes(entry.startTime)
      const existingEnd = timeToMinutes(entry.endTime)
      return startMinutes < existingEnd && endMinutes > existingStart
    })

    if (overlaps) {
      setTimingError('This time overlaps with another class. Please adjust your slot.')
      return
    }

    setData((current) => ({
      ...current,
      timetable: [
        ...current.timetable,
        {
          id: `t-${Date.now()}`,
          subject: timetableForm.subject,
          day: timetableForm.day,
          startTime: timetableForm.startTime,
          endTime: timetableForm.endTime,
          location: timetableForm.location.trim(),
        },
      ],
    }))
    setTimingError('')
    setTimetableForm({ ...initialTimetableForm, subject: timetableForm.subject })
  }

  const deleteTimetableItem = (itemId) => {
    setData((current) => ({
      ...current,
      timetable: current.timetable.filter((item) => item.id !== itemId),
    }))
  }

  const addExam = (event) => {
    event.preventDefault()
    if (!examForm.subject || !examForm.date) return

    setData((current) => ({
      ...current,
      exams: [...current.exams, { id: `e-${Date.now()}`, ...examForm, notes: examForm.notes.trim() }],
    }))
    setExamForm(initialExamForm)
  }

  const deleteExam = (examId) => {
    setData((current) => ({
      ...current,
      exams: current.exams.filter((exam) => exam.id !== examId),
    }))
  }

  const addAttendance = (event) => {
    event.preventDefault()
    const conducted = Number(attendanceForm.classesConducted)
    const attended = Number(attendanceForm.classesAttended)
    if (!attendanceForm.subject || Number.isNaN(conducted) || Number.isNaN(attended) || conducted < 0 || attended < 0 || attended > conducted) return

    setData((current) => ({
      ...current,
      attendance: [
        ...current.attendance.filter((item) => item.subject !== attendanceForm.subject),
        {
          id: `att-${Date.now()}`,
          subject: attendanceForm.subject,
          classesConducted: conducted,
          classesAttended: attended,
        },
      ],
    }))
    setAttendanceForm(initialAttendanceForm)
  }

  const deleteAttendance = (recordId) => {
    setData((current) => ({
      ...current,
      attendance: current.attendance.filter((item) => item.id !== recordId),
    }))
  }

  const addOpportunity = (event) => {
    event.preventDefault()
    if (!opportunityForm.title.trim() || !opportunityForm.organisation.trim()) return

    setData((current) => ({
      ...current,
      opportunities: [
        ...current.opportunities,
        {
          id: `o-${Date.now()}`,
          ...opportunityForm,
          title: opportunityForm.title.trim(),
          organisation: opportunityForm.organisation.trim(),
          description: opportunityForm.description.trim(),
          eligibility: opportunityForm.eligibility.trim(),
          source: opportunityForm.source.trim() || 'Sample listing - not verified live',
          saved: false,
          status: 'Interested',
        },
      ],
    }))
    setOpportunityForm(initialOpportunityForm)
  }

  const toggleSave = (opportunityId) => {
    setData((current) => ({
      ...current,
      opportunities: current.opportunities.map((item) =>
        item.id === opportunityId ? { ...item, saved: !item.saved } : item,
      ),
    }))
  }

  const updateOpportunityStatus = (opportunityId, status) => {
    setData((current) => ({
      ...current,
      opportunities: current.opportunities.map((item) =>
        item.id === opportunityId ? { ...item, status } : item,
      ),
    }))
  }

  const addPost = (event) => {
    event.preventDefault()
    if (!postForm.title.trim() || !postForm.content.trim()) return

    setData((current) => ({
      ...current,
      posts: [
        {
          id: `p-${Date.now()}`,
          ...postForm,
          title: postForm.title.trim(),
          content: postForm.content.trim(),
          author: postForm.author || 'You',
          time: 'Just now',
        },
        ...current.posts,
      ],
    }))
    setPostForm(initialPostForm)
  }

  const deletePost = (postId) => {
    setData((current) => ({
      ...current,
      posts: current.posts.filter((post) => post.id !== postId),
    }))
  }

  const toggleGroupMembership = (groupId) => {
    setData((current) => ({
      ...current,
      groups: current.groups.map((group) => {
        if (group.id !== groupId) return group
        const members = group.members.includes('You')
          ? group.members.filter((member) => member !== 'You')
          : [...group.members, 'You']
        return { ...group, members }
      }),
    }))
  }

  const addGroup = (event) => {
    event.preventDefault()
    if (!groupForm.name.trim()) return

    setData((current) => ({
      ...current,
      groups: [
        ...current.groups,
        {
          id: `g-${Date.now()}`,
          name: groupForm.name.trim(),
          category: groupForm.category,
          description: groupForm.description.trim(),
          members: groupForm.members ? groupForm.members.split(',').map((name) => name.trim()).filter(Boolean) : ['You'],
        },
      ],
    }))
    setGroupForm(initialGroupForm)
  }

  const handleAiPrompt = (event) => {
    event.preventDefault()
    const prompt = chatInput.trim()
    if (!prompt) return

    const userMessage = { role: 'user', message: prompt }
    const reply = generateAiReply(prompt)
    setChatHistory((current) => [...current, userMessage, { role: 'assistant', message: reply }])
    setChatInput('')
  }

  const generateAiReply = (prompt) => {
    const lower = prompt.toLowerCase()
    if (lower.includes('study plan') || lower.includes('schedule')) {
      const topic = data.subjects[0]?.name || 'your primary subject'
      return `Suggested plan: 2 focused sessions on ${topic} this week, followed by one review block on your most urgent assignment. Keep 45-minute deep work sprints and reserve 20 minutes for active recall before each deadline.`
    }
    if (lower.includes('question') || lower.includes('practice')) {
      return 'Practice question: Explain how a greedy approach could fail in a shortest-path problem. What conditions must be satisfied before choosing a greedy strategy?'
    }
    if (lower.includes('explain') || lower.includes('concept')) {
      return 'Concept explanation: Start with the core idea, then compare it to a common misconception. Use a concrete example, then finish with a brief summary in plain English and one exam-style application prompt.'
    }
    if (lower.includes('session') || lower.includes('goal')) {
      return 'Study session plan: 10-minute warm-up, 25-minute focus sprint, 10-minute recall check, and a final 5-minute reflection. Repeat twice for larger goals.'
    }
    return `I can help with that. For a quick plan, break the task into three steps: define the goal, schedule one active-review block, and end with a short recap using the concepts from ${data.subjects[0]?.name || 'your current course'}.`
  }

  const subjectOptions = data.subjects.map((subject) => subject.name)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">C1</div>
          <div>
            <p className="eyebrow">Student life</p>
            <h2>CampusOne</h2>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={item === activeTab ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="avatar">AK</div>
            <div>
              <strong>Aisha Khan</strong>
              <p>Computer Science • Year 2</p>
            </div>
          </div>
          <button type="button" className="secondary-button">Profile & settings</button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{todayInfo.label}</h1>
          </div>
          <div className="topbar-actions">
            <div className="search-pill">
              <span>⌕</span>
              <input type="text" placeholder="Search coursework, people, or opportunities" />
            </div>
            <button type="button" className="icon-button">🔔</button>
            <button type="button" className="icon-button">⚙️</button>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <section className="page-section">
            <div className="hero-panel">
              <div>
                <p className="eyebrow accent">Overview</p>
                <h2>Good afternoon, Aisha.</h2>
                <p>
                  You have <strong>{assignmentInsights.upcoming.length}</strong> upcoming deadlines and <strong>{attendanceInsights.low.length}</strong> low-attendance courses to review.
                </p>
              </div>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => setActiveTab('Academic Hub')}>Add assignment</button>
                <button type="button" className="secondary-button" onClick={() => setActiveTab('Academic Hub')}>Open timetable</button>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-card accent-card">
                <label>Assignment completion</label>
                <strong>{assignmentInsights.completionRate}%</strong>
                <span>{assignmentInsights.completedAssignments}/{assignmentInsights.totalAssignments} completed</span>
              </article>
              <article className="stat-card">
                <label>Average attendance</label>
                <strong>{attendanceInsights.averageAttendance}%</strong>
                <span>{data.attendance.length} tracked subjects</span>
              </article>
              <article className="stat-card">
                <label>Upcoming exams</label>
                <strong>{upcomingExams.length}</strong>
                <span>Across {data.subjects.length} subjects</span>
              </article>
              <article className="stat-card">
                <label>Saved opportunities</label>
                <strong>{data.opportunities.filter((item) => item.saved).length}</strong>
                <span>Keep exploring</span>
              </article>
            </div>

            <div className="content-grid">
              <div className="column-stack">
                <section className="panel-card">
                  <div className="panel-header">
                    <h3>Today&apos;s timetable</h3>
                    <span className="badge muted">{todayInfo.label}</span>
                  </div>
                  {todaysClasses.length ? (
                    <ul className="list-timeline">
                      {todaysClasses.map((item) => (
                        <li key={item.id}>
                          <div className="timeline-time">{item.startTime} - {item.endTime}</div>
                          <div>
                            <strong>{item.subject}</strong>
                            <p>{item.location}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state">No classes scheduled today.</div>
                  )}
                </section>

                <section className="panel-card">
                  <div className="panel-header">
                    <h3>Upcoming deadlines</h3>
                    <span className="badge neutral">{assignmentInsights.upcoming.length}</span>
                  </div>
                  <ul className="task-list">
                    {assignmentInsights.upcoming.slice(0, 4).map((item) => (
                      <li key={item.id} className={item.priority === 'High' ? 'high' : ''}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.subject}</p>
                        </div>
                        <span>{formatDate(item.dueDate)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="column-stack">
                <section className="panel-card">
                  <div className="panel-header">
                    <h3>Recommended opportunities</h3>
                    <button type="button" className="text-button" onClick={() => setActiveTab('Opportunity Explorer')}>Explore all</button>
                  </div>
                  <div className="mini-stack">
                    {data.opportunities.slice(0, 3).map((item) => (
                      <div key={item.id} className="mini-card">
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.category}</p>
                        </div>
                        <span className="chip">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel-card">
                  <div className="panel-header">
                    <h3>Campus announcements</h3>
                    <span className="badge soft">Live</span>
                  </div>
                  <ul className="announcement-list">
                    <li>
                      <strong>Research fair</strong>
                      <p>Register before Friday for faculty-led projects and lab demos.</p>
                    </li>
                    <li>
                      <strong>Study lounge upgrade</strong>
                      <p>New charging stations and quiet rooms open on the third floor.</p>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Academic Hub' && (
          <section className="page-section">
            <div className="module-grid">
              <article className="panel-card">
                <div className="panel-header">
                  <h3>Subjects</h3>
                </div>
                <form className="stack-form" onSubmit={addSubject}>
                  <input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="Subject name" />
                  <input value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value })} placeholder="Code" />
                  <textarea value={subjectForm.description} onChange={(event) => setSubjectForm({ ...subjectForm, description: event.target.value })} placeholder="Optional description" rows="3" />
                  <button type="submit" className="primary-button">Add subject</button>
                </form>
                <ul className="entity-list compact-list">
                  {data.subjects.map((subject) => (
                    <li key={subject.id}>
                      <div>
                        <strong>{subject.name}</strong>
                        <p>{subject.code}</p>
                      </div>
                      <button type="button" className="danger-button" onClick={() => deleteSubject(subject.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Assignments</h3>
                </div>
                <form className="stack-form" onSubmit={addAssignment}>
                  <input value={assignmentForm.title} onChange={(event) => setAssignmentForm({ ...assignmentForm, title: event.target.value })} placeholder="Assignment title" />
                  <textarea value={assignmentForm.description} onChange={(event) => setAssignmentForm({ ...assignmentForm, description: event.target.value })} placeholder="Description" rows="3" />
                  <select value={assignmentForm.subject} onChange={(event) => setAssignmentForm({ ...assignmentForm, subject: event.target.value })}>
                    <option value="">Choose subject</option>
                    {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <div className="double-input">
                    <input type="date" value={assignmentForm.dueDate} onChange={(event) => setAssignmentForm({ ...assignmentForm, dueDate: event.target.value })} />
                    <select value={assignmentForm.priority} onChange={(event) => setAssignmentForm({ ...assignmentForm, priority: event.target.value })}>
                      {priorityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <select value={assignmentForm.status} onChange={(event) => setAssignmentForm({ ...assignmentForm, status: event.target.value })}>
                    {assignmentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button type="submit" className="primary-button">Add assignment</button>
                </form>
                <div className="filter-row">
                  <input value={assignmentSearch} onChange={(event) => setAssignmentSearch(event.target.value)} placeholder="Search assignments" />
                  <select value={assignmentFilter} onChange={(event) => setAssignmentFilter(event.target.value)}>
                    <option value="All">All subjects</option>
                    {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                </div>
                <ul className="entity-list task-list large-list">
                  {filteredAssignments.map((assignment) => (
                    <li key={assignment.id} className={assignment.dueDate < todayInfo.iso && assignment.status !== 'Completed' ? 'overdue' : ''}>
                      <div className="assignment-copy">
                        <strong>{assignment.title}</strong>
                        <p>{assignment.subject} • {assignment.priority}</p>
                        <small>{formatDate(assignment.dueDate)}</small>
                      </div>
                      <div className="stack-actions">
                        <select value={assignment.status} onChange={(event) => updateAssignmentStatus(assignment.id, event.target.value)}>
                          {assignmentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <button type="button" className="danger-button" onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Timetable</h3>
                </div>
                <form className="stack-form" onSubmit={addTimetableItem}>
                  <select value={timetableForm.subject} onChange={(event) => setTimetableForm({ ...timetableForm, subject: event.target.value })}>
                    <option value="">Choose subject</option>
                    {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <div className="double-input">
                    <select value={timetableForm.day} onChange={(event) => setTimetableForm({ ...timetableForm, day: event.target.value })}>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <input value={timetableForm.location} onChange={(event) => setTimetableForm({ ...timetableForm, location: event.target.value })} placeholder="Location" />
                  </div>
                  <div className="double-input">
                    <input type="time" value={timetableForm.startTime} onChange={(event) => setTimetableForm({ ...timetableForm, startTime: event.target.value })} />
                    <input type="time" value={timetableForm.endTime} onChange={(event) => setTimetableForm({ ...timetableForm, endTime: event.target.value })} />
                  </div>
                  {timingError && <p className="warning-text">{timingError}</p>}
                  <button type="submit" className="primary-button">Add class</button>
                </form>
                <ul className="entity-list compact-list">
                  {data.timetable.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.subject}</strong>
                        <p>{item.day} • {item.startTime} - {item.endTime}</p>
                      </div>
                      <button type="button" className="danger-button" onClick={() => deleteTimetableItem(item.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Examinations</h3>
                </div>
                <form className="stack-form" onSubmit={addExam}>
                  <select value={examForm.subject} onChange={(event) => setExamForm({ ...examForm, subject: event.target.value })}>
                    <option value="">Choose subject</option>
                    {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <input type="date" value={examForm.date} onChange={(event) => setExamForm({ ...examForm, date: event.target.value })} />
                  <textarea value={examForm.notes} onChange={(event) => setExamForm({ ...examForm, notes: event.target.value })} rows="3" placeholder="Preparation notes" />
                  <button type="submit" className="primary-button">Add exam</button>
                </form>
                <ul className="entity-list compact-list">
                  {upcomingExams.map((exam) => (
                    <li key={exam.id}>
                      <div>
                        <strong>{exam.subject}</strong>
                        <p>{formatDate(exam.date)}</p>
                      </div>
                      <button type="button" className="danger-button" onClick={() => deleteExam(exam.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Attendance</h3>
                </div>
                <form className="stack-form" onSubmit={addAttendance}>
                  <select value={attendanceForm.subject} onChange={(event) => setAttendanceForm({ ...attendanceForm, subject: event.target.value })}>
                    <option value="">Choose subject</option>
                    {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <div className="double-input">
                    <input type="number" min="0" value={attendanceForm.classesConducted} onChange={(event) => setAttendanceForm({ ...attendanceForm, classesConducted: event.target.value })} placeholder="Conducted" />
                    <input type="number" min="0" value={attendanceForm.classesAttended} onChange={(event) => setAttendanceForm({ ...attendanceForm, classesAttended: event.target.value })} placeholder="Attended" />
                  </div>
                  <button type="submit" className="primary-button">Save attendance</button>
                </form>
                <ul className="entity-list compact-list">
                  {data.attendance.map((item) => {
                    const percent = item.classesConducted ? Math.round((item.classesAttended / item.classesConducted) * 100) : 0
                    const warning = percent < data.attendanceThreshold
                    return (
                      <li key={item.id}>
                        <div>
                          <strong>{item.subject}</strong>
                          <p>{item.classesAttended}/{item.classesConducted} classes • {percent}%</p>
                        </div>
                        <span className={warning ? 'chip danger' : 'chip'}>{warning ? 'Low attendance' : 'Healthy'}</span>
                        <button type="button" className="danger-button" onClick={() => deleteAttendance(item.id)}>Delete</button>
                      </li>
                    )
                  })}
                </ul>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'Opportunity Explorer' && (
          <section className="page-section">
            <div className="toolbar">
              <input value={opportunityQuery} onChange={(event) => setOpportunityQuery(event.target.value)} placeholder="Search opportunities" />
              <select value={opportunityFilter} onChange={(event) => setOpportunityFilter(event.target.value)}>
                <option value="All">All categories</option>
                {['Internships and jobs', 'Hackathons and competitions', 'Scholarships', 'Certifications and online courses', 'Open-source programs'].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="panel-card full-panel">
              <div className="panel-header">
                <h3>Opportunity directory</h3>
                <span className="badge muted">Sample listings only</span>
              </div>

              <form className="stack-form compact-form" onSubmit={addOpportunity}>
                <div className="double-input">
                  <input value={opportunityForm.title} onChange={(event) => setOpportunityForm({ ...opportunityForm, title: event.target.value })} placeholder="Title" />
                  <input value={opportunityForm.organisation} onChange={(event) => setOpportunityForm({ ...opportunityForm, organisation: event.target.value })} placeholder="Organisation" />
                </div>
                <div className="double-input">
                  <select value={opportunityForm.category} onChange={(event) => setOpportunityForm({ ...opportunityForm, category: event.target.value })}>
                    {['Internships and jobs', 'Hackathons and competitions', 'Scholarships', 'Certifications and online courses', 'Open-source programs'].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input type="date" value={opportunityForm.deadline} onChange={(event) => setOpportunityForm({ ...opportunityForm, deadline: event.target.value })} />
                </div>
                <textarea rows="3" value={opportunityForm.description} onChange={(event) => setOpportunityForm({ ...opportunityForm, description: event.target.value })} placeholder="Description" />
                <div className="double-input">
                  <input value={opportunityForm.eligibility} onChange={(event) => setOpportunityForm({ ...opportunityForm, eligibility: event.target.value })} placeholder="Eligibility" />
                  <input value={opportunityForm.source} onChange={(event) => setOpportunityForm({ ...opportunityForm, source: event.target.value })} placeholder="Source link or label" />
                </div>
                <button type="submit" className="primary-button">Add opportunity</button>
              </form>

              <div className="opportunity-grid">
                {filteredOpportunities.map((item) => (
                  <article key={item.id} className="opportunity-card">
                    <div className="card-head">
                      <div>
                        <p className="eyebrow">{item.category}</p>
                        <h4>{item.title}</h4>
                      </div>
                      <button type="button" className={item.saved ? 'icon-button active' : 'icon-button'} onClick={() => toggleSave(item.id)}>
                        {item.saved ? '★' : '☆'}
                      </button>
                    </div>
                    <p className="muted-text">{item.organisation}</p>
                    <p>{item.description}</p>
                    <div className="meta-row">
                      <span>Deadline: {item.deadline ? formatDate(item.deadline) : 'Flexible'}</span>
                      <span>{item.source}</span>
                    </div>
                    <div className="meta-row">
                      <span>{item.eligibility || 'Eligibility details not yet entered'}</span>
                    </div>
                    <div className="card-footer">
                      <select value={item.status} onChange={(event) => updateOpportunityStatus(item.id, event.target.value)}>
                        {opportunityStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <button type="button" className="secondary-button">View details</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Campus Community' && (
          <section className="page-section">
            <div className="toolbar">
              <input value={communityQuery} onChange={(event) => setCommunityQuery(event.target.value)} placeholder="Search posts or community ideas" />
              <select value={communityFilter} onChange={(event) => setCommunityFilter(event.target.value)}>
                {communityCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>

            <div className="content-grid community-grid">
              <article className="panel-card">
                <div className="panel-header">
                  <h3>Share an update</h3>
                  <span className="badge muted">Local demo</span>
                </div>
                <form className="stack-form" onSubmit={addPost}>
                  <input value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} placeholder="Title" />
                  <select value={postForm.category} onChange={(event) => setPostForm({ ...postForm, category: event.target.value })}>
                    {communityCategories.filter((item) => item !== 'All').map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <textarea rows="4" value={postForm.content} onChange={(event) => setPostForm({ ...postForm, content: event.target.value })} placeholder="What are you working on?" />
                  <button type="submit" className="primary-button">Publish post</button>
                </form>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Study groups</h3>
                </div>
                <form className="stack-form" onSubmit={addGroup}>
                  <input value={groupForm.name} onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })} placeholder="Group name" />
                  <select value={groupForm.category} onChange={(event) => setGroupForm({ ...groupForm, category: event.target.value })}>
                    <option value="Study Group">Study Group</option>
                    <option value="Project">Project</option>
                  </select>
                  <textarea rows="3" value={groupForm.description} onChange={(event) => setGroupForm({ ...groupForm, description: event.target.value })} placeholder="Description" />
                  <button type="submit" className="primary-button">Create group</button>
                </form>
                <ul className="entity-list compact-list">
                  {data.groups.map((group) => (
                    <li key={group.id}>
                      <div>
                        <strong>{group.name}</strong>
                        <p>{group.members.length} members</p>
                      </div>
                      <button type="button" className={group.members.includes('You') ? 'secondary-button' : 'primary-button'} onClick={() => toggleGroupMembership(group.id)}>
                        {group.members.includes('You') ? 'Leave' : 'Join'}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="panel-card full-panel">
              <div className="panel-header">
                <h3>Feed</h3>
              </div>
              <div className="post-list">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="post-card">
                    <div className="card-head">
                      <div>
                        <span className="chip soft">{post.category}</span>
                        <h4>{post.title}</h4>
                      </div>
                      <button type="button" className="danger-button" onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                    <p>{post.content}</p>
                    <div className="meta-row">
                      <span>{post.author}</span>
                      <span>{post.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Academic Insights' && (
          <section className="page-section">
            <div className="stats-grid">
              <article className="stat-card">
                <label>Assignment completion</label>
                <strong>{assignmentInsights.completionRate}%</strong>
                <span>Completed / total</span>
              </article>
              <article className="stat-card">
                <label>Attendance</label>
                <strong>{attendanceInsights.averageAttendance}%</strong>
                <span>Average across recorded subjects</span>
              </article>
              <article className="stat-card">
                <label>Assignments due</label>
                <strong>{assignmentInsights.upcoming.length}</strong>
                <span>Upcoming and current</span>
              </article>
              <article className="stat-card">
                <label>Exams booked</label>
                <strong>{data.exams.length}</strong>
                <span>Recorded assessments</span>
              </article>
            </div>

            <div className="content-grid analytics-grid">
              <article className="panel-card">
                <div className="panel-header">
                  <h3>Subject completion</h3>
                </div>
                <div className="bar-chart">
                  {subjectSummary.map((item) => (
                    <div key={item.name} className="bar-group">
                      <div className="bar-track">
                        <div className="bar-fill" style={{ height: `${Math.max(item.value, 8)}%` }} />
                      </div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Study activity</h3>
                </div>
                <StudyLineChart data={data.studyLogs} />
              </article>
            </div>

            <div className="panel-card full-panel">
              <div className="panel-header">
                <h3>Warnings and metric notes</h3>
              </div>
              <div className="warning-stack">
                {attendanceInsights.low.length ? (
                  attendanceInsights.low.map((item) => (
                    <div key={item.id} className="warning-item">
                      <strong>{item.subject}</strong>
                      <p>Attendance is below {data.attendanceThreshold}% threshold.</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No low-attendance warnings right now.</div>
                )}
              </div>
              <p className="metric-note">
                Metrics are calculated from live records: assignment completion is tasks marked Completed divided by all assignments; attendance is classes attended divided by classes conducted; subject completion is completed assignments per subject. Weekly study activity uses logged minutes from your study sessions and can be updated as you progress.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'AI Study Assistant' && (
          <section className="page-section">
            <div className="ai-grid">
              <article className="panel-card ai-panel">
                <div className="panel-header">
                  <h3>AI study partner</h3>
                  <span className="badge soft">Demo mode</span>
                </div>
                <div className="chat-box">
                  {chatHistory.map((entry, index) => (
                    <div key={`${entry.role}-${index}`} className={entry.role === 'assistant' ? 'chat-bubble assistant' : 'chat-bubble user'}>
                      <p>{entry.message}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-form" onSubmit={handleAiPrompt}>
                  <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask for a plan, questions, or explanation" />
                  <button type="submit" className="primary-button">Send</button>
                </form>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Study tools</h3>
                </div>
                <div className="tool-stack">
                  <div className="tool-card">
                    <h4>Study plan generator</h4>
                    <p>Example: “Create a 5-day plan for Algorithms with 4 hours a week.”</p>
                  </div>
                  <div className="tool-card">
                    <h4>Practice questions</h4>
                    <p>Ask for a set of quick MCQs or a short problem-solving challenge.</p>
                  </div>
                  <div className="tool-card">
                    <h4>Concept explainer</h4>
                    <p>Request beginner, intermediate, or advanced explanations for any concept.</p>
                  </div>
                  <div className="tool-card">
                    <h4>Session planner</h4>
                    <p>Break large learning goals into short, actionable study sessions.</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function StudyLineChart({ data }) {
  const width = 360
  const height = 180
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - (item.minutes / 150) * height
    return `${x},${y}`
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Study activity chart">
      <polyline points={points.join(' ')} fill="none" stroke="#2e6f4c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - (item.minutes / 150) * height
        return <circle key={item.date} cx={x} cy={y} r="4" fill="#e2823f" />
      })}
    </svg>
  )
}

export default App
