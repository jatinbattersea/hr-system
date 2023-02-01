const lateArrivals = (array, shifts) => {
    return array.filter((row) => {
            let startTime;
            if (typeof shifts === "object") {
                startTime = shifts.startTime;
            } else {
                for (let i = 0; i < shifts.data.length; i++) {
                    if (shifts.data[i].employeeID === row.employeeId) {
                        startTime = shifts.data[i].shift.startTime;
                        break;
                    }
                }
            }
            const time1 = startTime || "10:00 AM";
            const time2 = row.timeIn;

            const [hours1, minutes1] = time1.split(':');

            const [hours2, minutes2] = time2.split(':');

            const date1 = new Date(2022, 0, 1, +hours1, +minutes1.match(/\d+/)[0]);
            const date2 = new Date(2022, 0, 1, +hours2, +(minutes2.match(/\d+/) == null ? '00' : minutes2.match(/\d+/)[0]));

            return date2.getTime() > date1.getTime()
        });
}

const attendenceObjectToArray = (array) => {

    let tempData = {};
    let i = 1;
    let generatedArray = [];
    array.forEach((row) => {
        for (const dateProperty in row.schedule) {
          if (dateProperty !== "_id") {
            tempData = {
              id: i,
              name: row.name,
              employeeId: row.employeeID,
              date: dateProperty,
              day: row.schedule[dateProperty].day,
              timeIn: row.schedule[dateProperty].timeIn,
              timeOut: row.schedule[dateProperty].timeOut,
              status: row.schedule[dateProperty].status,
            };

            generatedArray.push(tempData);

            i++;
          }
        }
    });

    return generatedArray;
}

export default lateArrivals;

export { attendenceObjectToArray };