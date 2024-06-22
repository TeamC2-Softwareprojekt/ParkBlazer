import React, { useState, useEffect, useRef } from "react";
import { IonInput, IonDatetime, IonPopover } from "@ionic/react";
import "./DateInput.css";
import { format } from 'date-fns';
import { parkingSpace } from '../data/parkingSpaces';

export default function DateInput({ parkingspot, setStartDate, setEndDate }: { parkingspot: parkingSpace, setStartDate: any, setEndDate: any }) {
  const [start_date, setThisStartDate] = useState<Date | null>(null);
  const [end_date, setThisEndDate] = useState<Date | null>(null);
  const [selectStart, setSelectStart] = useState<boolean>(true);
  const calendarRef = useRef<HTMLIonDatetimeElement>(null);

  useEffect(() => {
    if (!start_date) {
      let date = new Date();
      if (date.getMinutes() <= 59 && date.getMinutes() >= 15) date.setMinutes(30);
      else date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      let date2 = new Date(date);
      date2.setHours(date2.getHours() + 24);
      if (date2.getTime() > new Date(parkingspot?.availability_end_date!).getTime()) {
        date2 = new Date(parkingspot?.availability_end_date!);
      }
      setThisStartDate(date);
      setThisEndDate(date2);
    }
  });

  useEffect(() => {
    if (!start_date || !end_date) return;
    if (calendarRef.current) calendarRef.current.value = [start_date.toISOString(), end_date.toISOString()];
    setStartDate(start_date);
    setEndDate(end_date);
  }, [start_date, end_date]);

  function handleDateTextChange(e: any) {
    const [datePart, timePart] = String(e.target.value)?.split(' ');
    if (!datePart || !timePart) {
      if (e.target.classList.contains("start-date"))
        e.target.value = format(start_date!, 'dd.MM.yyyy HH:mm');
      else e.target.value = format(end_date!, 'dd.MM.yyyy HH:mm');
      return;
    }

    let [hours, minutes] = timePart.split(':');
    let [day, month, year] = datePart.split('.');
    if (!hours || !minutes || !day || !month || !year) {
      if (e.target.classList.contains("start-date"))
        e.target.value = format(start_date!, 'dd.MM.yyyy HH:mm');
      else e.target.value = format(end_date!, 'dd.MM.yyyy HH:mm');
      return;
    }

    day = day.length < 2 ? "0" + day : day;
    month = month.length < 2 ? "0" + month : month;
    hours = hours.length < 2 ? "0" + hours : hours;
    minutes = minutes.length < 2 ? "0" + minutes : minutes;
    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

    if (isNaN(date.getTime())) {
      console.error("Invalid date");
      e.target.value = format(e.target.classList.contains("start-date") ? start_date! : end_date!, 'dd.MM.yyyy HH:mm');
      return;
    }

    if (date.getMinutes() <= 59 && date.getMinutes() >= 15) {
      date.setMinutes(30);
    } else {
      date.setMinutes(0);
    }

    if (e.target.classList.contains("start-date")) {
      if (date.getTime() > end_date?.getTime()!) {
        if (date.getTime() > new Date(parkingspot?.availability_end_date!).getTime()) {
          setThisEndDate(new Date(parkingspot?.availability_end_date!));
          return;
        }
        setThisEndDate(date);
        return;
      }
      if (date.getTime() < new Date(parkingspot?.availability_start_date!).getTime()) {
        setThisStartDate(new Date(parkingspot?.availability_start_date!));
        return;
      }
      setThisStartDate(date);
    } else {
      if (date.getTime() < start_date?.getTime()!) {
        if (date.getTime() < new Date(parkingspot?.availability_start_date!).getTime()) {
          setThisStartDate(new Date(parkingspot?.availability_start_date!));
          return;
        }
        setThisStartDate(date);
        return;
      }
      if (date.getTime() > new Date(parkingspot?.availability_end_date!).getTime()) {
        setThisEndDate(new Date(parkingspot?.availability_end_date!));
        return;
      }
      setThisEndDate(date);
    }
  }

  function handleDateChange(e: any) {
    if (!e.target.value) return;

    if (e.target.value.length == 1) {
      let date = new Date(e.target.value[0]);
      date.setHours(12);
      setThisStartDate(date);
      setThisEndDate(date);
      return;
    }

    let [year, month, day] = String(e.target.value[2]).split('-');
    const date = new Date(`${year}-${month}-${day}T12:00:00`);

    if (isNaN(date.getTime())) {
      console.error("Invalid date");
      e.target.value = format(e.target.classList.contains("start-date") ? start_date! : end_date!, 'dd.MM.yyyy HH:mm');
      return;
    }
    
    if (start_date == end_date) {
      if (date.getTime() < start_date?.getTime()!) {
        setThisStartDate(date);
      }
      else {
        setThisEndDate(date);
      }
      return;
    }

    let dateIsCloserToStart = Math.abs(date.getTime() - start_date?.getTime()!) < Math.abs(date.getTime() - end_date?.getTime()!);
    if ((date.getTime() < start_date?.getTime()! && !selectStart) || (date.getTime() > end_date?.getTime()! && selectStart)) {
      if (dateIsCloserToStart) {
        setThisStartDate(date);
      } else {
        setThisEndDate(date);
      }
    }
    else if (selectStart) {
      setThisStartDate(date);
    }
    else {
      setThisEndDate(date);
    }
    setSelectStart(!selectStart);
  }

  return (
    <>
      <div className="date-input-container">
        <div className="date-first-input">
          <IonInput value={start_date ? format(start_date!, 'dd.MM.yyyy HH:mm') : ""} label="Start Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY HH:mm" onIonChange={e => handleDateTextChange(e)} id="start-date-text-input" className="date-input start-date" />
        </div>
        <div>
          <IonInput value={end_date ? format(end_date!, 'dd.MM.yyyy HH:mm') : ""} label="End Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY HH:mm" onIonChange={e => handleDateTextChange(e)} className="date-input end-date" />
        </div>
      </div>
      <IonPopover keepContentsMounted={true} trigger="start-date-text-input" id="date-card-popover" side="bottom" alignment="start">
        <div id="date-card-popover-input-container">
          <div className="date-input-container">
            <div>
              <IonInput value={start_date ? format(start_date!, 'dd.MM.yyyy HH:mm') : ""} label="Start Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY HH:mm" onIonChange={e => handleDateTextChange(e)} className="date-input start-date" />
            </div>
            <div>
              <IonInput value={end_date ? format(end_date!, 'dd.MM.yyyy HH:mm') : ""} label="End Datum" labelPlacement="stacked" placeholder="DD-MM-YYYY HH:mm" onIonChange={e => handleDateTextChange(e)} className="date-input end-date" />
            </div>
          </div>
          <IonDatetime ref={calendarRef} presentation="date" multiple={true} minuteValues={"0,30"} min={parkingspot?.availability_start_date} max={parkingspot?.availability_end_date} onIonChange={e => handleDateChange(e)} />
        </div>
      </IonPopover>
    </>
  );
}