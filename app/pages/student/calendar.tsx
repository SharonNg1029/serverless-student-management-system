import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Heading,
  IconButton,
  Button,
  Circle,
  HStack,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { fetchCalendarAssignments } from '~/services/studentApi'
import { AssignmentModal } from '~/components'
import type { CalendarAssignment } from '~/types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Assignment type colors
const TYPE_COLORS: Record<CalendarAssignment['type'], string> = {
  homework: 'green.500',
  project: 'purple.500',
  midterm: 'orange.500',
  final: 'red.500',
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  assignments: CalendarAssignment[]
}

export default function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAssignment, setSelectedAssignment] = useState<CalendarAssignment | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['calendar-assignments', currentDate.getMonth(), currentDate.getFullYear()],
    queryFn: () => fetchCalendarAssignments(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    ),
  })

  // Generate calendar days
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // First day of month
    const firstDay = new Date(year, month, 1)
    // Last day of month
    const lastDay = new Date(year, month + 1, 0)
    
    // Start from Sunday of first week
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    // End at Saturday of last week
    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
    
    const days: CalendarDay[] = []
    const current = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0]
      const dayAssignments = assignments.filter(a => {
        const assignmentDate = new Date(a.deadline).toISOString().split('T')[0]
        return assignmentDate === dateStr
      })
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.getTime() === today.getTime(),
        assignments: dayAssignments,
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }, [currentDate, assignments])

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Handle assignment click
  const handleAssignmentClick = (assignment: CalendarAssignment) => {
    setSelectedAssignment(assignment)
    setModalOpen(true)
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={4}>
          <Circle size="12" bg="blue.500" color="white">
            <CalendarIcon size={24} />
          </Circle>
          <Heading size="xl">Calendar</Heading>
        </Flex>
        
        <HStack gap={2}>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <IconButton
            aria-label="Previous month"
            variant="ghost"
            size="sm"
            onClick={goToPrevMonth}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            aria-label="Next month"
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight size={20} />
          </IconButton>
          <Heading size="lg" minW="200px" textAlign="center">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Heading>
        </HStack>
      </Flex>

      {/* Legend */}
      <Flex gap={6} mb={4} flexWrap="wrap">
        <HStack gap={2}>
          <Circle size="3" bg="green.500" />
          <Text fontSize="sm">Homework</Text>
        </HStack>
        <HStack gap={2}>
          <Circle size="3" bg="purple.500" />
          <Text fontSize="sm">Project</Text>
        </HStack>
        <HStack gap={2}>
          <Circle size="3" bg="orange.500" />
          <Text fontSize="sm">Midterm</Text>
        </HStack>
        <HStack gap={2}>
          <Circle size="3" bg="red.500" />
          <Text fontSize="sm">Final</Text>
        </HStack>
      </Flex>

      {isLoading ? (
        <Center h="400px">
          <VStack gap={4}>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.500">Loading calendar...</Text>
          </VStack>
        </Center>
      ) : (
        <Box
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          {/* Day headers */}
          <Grid templateColumns="repeat(7, 1fr)" bg="gray.100">
            {DAYS.map(day => (
              <GridItem key={day} p={3} textAlign="center">
                <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                  {day}
                </Text>
              </GridItem>
            ))}
          </Grid>

          {/* Calendar grid */}
          <Grid
            templateColumns="repeat(7, 1fr)"
            templateRows={`repeat(${Math.ceil(calendarDays.length / 7)}, 1fr)`}
          >
            {calendarDays.map((day, index) => (
              <GridItem
                key={index}
                p={2}
                minH="100px"
                bg={day.isToday ? 'blue.50' : day.isCurrentMonth ? 'white' : 'gray.50'}
                borderTop="1px solid"
                borderLeft={index % 7 === 0 ? 'none' : '1px solid'}
                borderColor="gray.200"
                position="relative"
              >
                {/* Date number */}
                <Text
                  fontSize="sm"
                  fontWeight={day.isToday ? 'bold' : 'normal'}
                  color={day.isCurrentMonth ? (day.isToday ? 'blue.600' : 'gray.800') : 'gray.400'}
                  mb={1}
                >
                  {day.isToday ? (
                    <Circle
                      size="7"
                      bg="blue.500"
                      color="white"
                      display="inline-flex"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      {day.date.getDate()}
                    </Circle>
                  ) : (
                    day.date.getDate()
                  )}
                </Text>

                {/* Assignments */}
                <VStack align="stretch" gap={1}>
                  {day.assignments.slice(0, 3).map(assignment => (
                    <Box
                      key={assignment.id}
                      px={2}
                      py={1}
                      bg={TYPE_COLORS[assignment.type]}
                      color="white"
                      borderRadius="sm"
                      fontSize="xs"
                      cursor="pointer"
                      _hover={{ opacity: 0.8 }}
                      onClick={() => handleAssignmentClick(assignment)}
                      lineClamp={1}
                    >
                      {assignment.title}
                    </Box>
                  ))}
                  {day.assignments.length > 3 && (
                    <Text fontSize="xs" color="gray.500" pl={1}>
                      +{day.assignments.length - 3} more
                    </Text>
                  )}
                </VStack>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        assignment={selectedAssignment}
      />
    </Box>
  )
}
