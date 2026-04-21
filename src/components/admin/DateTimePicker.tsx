"use client"
import { useState, useRef, useEffect } from "react"
import styles from "./DateTimePicker.module.scss"

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))

interface Props {
  date: string
  time: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export default function DateTimePicker({ date, time, onDateChange, onTimeChange }: Props) {
  const [calOpen, setCalOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => date ? new Date(date).getFullYear() : new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => date ? new Date(date).getMonth() : new Date().getMonth())

  const calRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<HTMLDivElement>(null)
  const minRef = useRef<HTMLDivElement>(null)

  const selectedHour = time ? time.slice(0, 2) : ""
  const selectedMin = time ? time.slice(3, 5) : ""

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false)
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Scroll selected hour/min into view when time picker opens
  useEffect(() => {
    if (!timeOpen) return
    setTimeout(() => {
      if (hourRef.current && selectedHour) {
        const el = hourRef.current.querySelector(`[data-value="${selectedHour}"]`) as HTMLElement
        if (el) el.scrollIntoView({ block: "center" })
      }
      if (minRef.current && selectedMin) {
        const el = minRef.current.querySelector(`[data-value="${selectedMin}"]`) as HTMLElement
        if (el) el.scrollIntoView({ block: "center" })
      }
    }, 50)
  }, [timeOpen])

  function formatDisplayDate(dateStr: string) {
    if (!dateStr) return null
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }

  function formatDisplayTime(timeStr: string) {
    if (!timeStr) return null
    return timeStr
  }

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  function handleDayClick(day: number) {
    const mm = String(viewMonth + 1).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    onDateChange(`${viewYear}-${mm}-${dd}`)
    setCalOpen(false)
  }

  function handleHourClick(hour: string) {
    const min = selectedMin || "00"
    onTimeChange(`${hour}:${min}`)
  }

  function handleMinClick(min: string) {
    const hour = selectedHour || "12"
    onTimeChange(`${hour}:${min}`)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const today = new Date()
  const selectedDate = date ? new Date(date + "T00:00:00") : null
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function isSelected(day: number) {
    if (!selectedDate) return false
    return selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
  }

  function isToday(day: number) {
    return today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  return (
    <div className={styles.dateTimeRow}>

      {/* Date picker */}
      <div className={styles.relative} ref={calRef}>
        <button
          type="button"
          onClick={() => { setCalOpen(o => !o); setTimeOpen(false) }}
          className={`${styles.dateButton} ${calOpen ? styles.open : ""} ${!date ? styles.placeholder : ""}`}
        >
          <span className={styles.fieldIcon}>📅</span>
          {date ? formatDisplayDate(date) : "Select date"}
        </button>

        {calOpen && (
          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <button type="button" onClick={prevMonth} className={styles.navButton}>‹</button>
              <span className={styles.calendarTitle}>{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" onClick={nextMonth} className={styles.navButton}>›</button>
            </div>

            <div className={styles.weekDays}>
              {DAYS.map(d => (
                <div key={d} className={styles.weekDay}>{d}</div>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className={`${styles.day} ${styles.empty}`} />
                const past = isPast(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !past && handleDayClick(day)}
                    className={[
                      styles.day,
                      isSelected(day) ? styles.selected : "",
                      isToday(day) && !isSelected(day) ? styles.today : "",
                      past ? styles.disabled : "",
                    ].join(" ")}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Time picker */}
      <div className={styles.relative} ref={timeRef}>
        <button
          type="button"
          onClick={() => { setTimeOpen(o => !o); setCalOpen(false) }}
          className={`${styles.timeButton} ${timeOpen ? styles.open : ""} ${!time ? styles.placeholder : ""}`}
        >
          <span className={styles.fieldIcon}>🕐</span>
          {time ? formatDisplayTime(time) : "Select time"}
        </button>

        {timeOpen && (
          <div className={styles.timeDropdown}>
            <div className={styles.timeColumnHeaders}>
              <div className={styles.timeColumnHeader}>Hour</div>
              <div className={styles.timeColumnHeader}>Minute</div>
            </div>

            <div className={styles.timeColumns}>
              {/* Hours */}
              <div className={styles.timeScroll} ref={hourRef}>
                {HOURS.map(h => (
                  <button
                    key={h}
                    type="button"
                    data-value={h}
                    onClick={() => handleHourClick(h)}
                    className={`${styles.timeOption} ${selectedHour === h ? styles.selectedTime : ""}`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* Minutes */}
              <div className={styles.timeScroll} ref={minRef}>
                {MINUTES.map(m => (
                  <button
                    key={m}
                    type="button"
                    data-value={m}
                    onClick={() => handleMinClick(m)}
                    className={`${styles.timeOption} ${selectedMin === m ? styles.selectedTime : ""}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.timeConfirm}>
              <button
                type="button"
                onClick={() => setTimeOpen(false)}
                className={styles.timeConfirmBtn}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}