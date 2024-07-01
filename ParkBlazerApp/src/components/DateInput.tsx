import React, { useState, useEffect, useRef } from "react";
import { IonInput, IonDatetime, IonPopover } from "@ionic/react";
import "./DateInput.css";
import { format, parse, isValid } from 'date-fns';
import { parkingSpace } from '../data/parkingSpaces';
import { adjustDateToAvailability, adjustMinutes, findRestrictedDateInRange } from "../utils/dateUtils";
import { getReservedDates } from "../data/reservation";

export default function DateInput({ parkingspace, setStartDate, setEndDate }: { parkingspace: parkingSpace, setStartDate: any, setEndDate: any }) {
  const [start_date, setThisStartDate] = useState<Date | null>(null);
  const [end_date, setThisEndDate] = useState<Date | null>(null);
  const [selectStart, setSelectStart] = useState<boolean>(true);
  const [restrictedDates, setRestrictedDates] = useState<Date[][]>([]);
  const calendarRef = useRef<HTMLIonDatetimeElement>(null);

  useEffect(() => {
    async function fetchRestrictedDates() {
      let data = await getReservedDates(parkingspace.private_parkingspot_id!);
      setRestrictedDates(data.map(reservation => [new Date(reservation.start_date), new Date(reservation.end_date)]));
    }

    fetchRestrictedDates();
  }, []);

  useEffect(() => {
    if (!start_date || !end_date) return;
    if (calendarRef.current) calendarRef.current.value = [start_date.toISOString(), end_date.toISOString()];
    setStartDate(start_date);
    setEndDate(end_date);
  }, [start_date, end_date]);

  function parseDateTimeFromInput(inputValue: string): Date | null {
    const [datePart, timePart] = inputValue.split(' ');
    if (!datePart || !timePart) return null;

    const date = parse(`${datePart} ${timePart}`, 'dd.MM.yyyy HH:mm', new Date());
    return isValid(date) ? date : null;
  }

  function parseDateFromEvent(event: any): Date | null {
    const value = event.target.value;
    let date;

    if (value && Array.isArray(value) && value.length === 1) {
      date = new Date(value[0]);
      date.setHours(12);
    } else if (value && typeof value[2] === 'string') {
      const [year, month, day] = value[2].split('-');
      date = new Date(`${year}-${month}-${day}T10:00:00Z`);
    } else {
      return null;
    }

    return isNaN(date.getTime()) ? null : date;
  }

  function determineDateToUpdate(date: Date, startDate: Date, endDate: Date, selectStart: boolean): 'start' | 'end' {
    if (startDate === endDate || selectStart) {
      return 'start';
    } else if (Math.abs(date.getTime() - startDate.getTime()) < Math.abs(date.getTime() - endDate.getTime())) {
      return 'start';
    } else {
      return 'end';
    }
  }

  function handleDateChange(date: Date, isStartDate: boolean) {
    if (!date || findRestrictedDateInRange(date, date, restrictedDates)) return;

    const adjustedDate = adjustDateToAvailability(date, parkingspace, isStartDate);
    const otherDate = isStartDate ? end_date : start_date;

    if (otherDate && findRestrictedDateInRange(adjustedDate, otherDate, restrictedDates)) {
      setThisStartDate(adjustedDate);
      setThisEndDate(adjustedDate);
    } else {
      if (isStartDate) {
        if (adjustedDate > end_date!) setThisEndDate(adjustedDate);
        else setThisStartDate(adjustedDate);
      } else {
        if (adjustedDate < start_date!) setThisStartDate(adjustedDate);
        else setThisEndDate(adjustedDate);
      }
    }
  }

  function handleInvalidDate(event: any) {
    console.error("Invalid date");
    event.target.value = format(event.target.classList.contains("start-date") ? start_date! : end_date!, 'dd.MM.yyyy HH:mm');
  }

  // Handles changes from the text input
  function handleDateTextChange(event: any) {
    const inputValue = event.target.value;
    const isStartDate = event.target.classList.contains("start-date");

    const parsedDate = parseDateTimeFromInput(inputValue);
    if (!parsedDate || findRestrictedDateInRange(parsedDate, parsedDate, restrictedDates)) {
      handleInvalidDate(event);
      return;
    }

    const adjustedDate = adjustMinutes(parsedDate);
    handleDateChange(adjustedDate, isStartDate);
  }

  // Handles changes from the calendar
  function handleCalenderChange(e: any) {
    const date = parseDateFromEvent(e);
    if (!date) return;

    if (calendarRef?.current?.value?.length === 1) {
      setThisStartDate(date);
      setThisEndDate(date);
      return;
    }

    const dateToUpdate = determineDateToUpdate(date, start_date!, end_date!, selectStart);
    handleDateChange(date, dateToUpdate === 'start');
    setSelectStart(!selectStart);
  }

  return (
    <>
      <div className="date-input-container" id="date-card-popover-trigger">
        <IonInput value={start_date ? format(start_date, 'dd.MM.yyyy hh:mm') : ""} label="Start Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY hh:mm" onIonChange={e => handleDateTextChange(e)} className="date-input start-date" />
        <IonInput value={end_date ? format(end_date, 'dd.MM.yyyy hh:mm') : ""} label="End Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY hh:mm" onIonChange={e => handleDateTextChange(e)} className="date-input" />
      </div>
      <IonPopover keepContentsMounted={true} trigger="date-card-popover-trigger" id="date-card-popover" side="bottom" alignment="start">
        <div id="date-card-popover-input-container">
          <div className="date-input-container">
            <IonInput value={start_date ? format(start_date, 'dd.MM.yyyy hh:mm') : ""} label="Start Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY hh:mm" onIonChange={e => handleDateTextChange(e)} className="date-input start-date" />
            <IonInput value={end_date ? format(end_date, 'dd.MM.yyyy hh:mm') : ""} label="End Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY hh:mm" onIonChange={e => handleDateTextChange(e)} className="date-input" />
          </div>
          <IonDatetime isDateEnabled={dateISOString => !findRestrictedDateInRange(new Date(dateISOString), new Date(dateISOString), restrictedDates)} ref={calendarRef} presentation="date" multiple={true} min={parkingspace.availability_start_date} max={parkingspace.availability_end_date} onIonChange={e => handleCalenderChange(e)} />
        </div>
      </IonPopover>
    </>
  );
}