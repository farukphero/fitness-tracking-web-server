(function() {
    const form    = document.getElementById('calc-form');
    const results = document.getElementById('results');
    const errors  = document.getElementById('form-error');

    /**
     * Display a form validation error
     *
     * @param   {String}  msg  The validation message
     * @return  {Boolen}       Returns false
     */
    function errorMessage(msg) {
        errors.innerHTML = msg;
        errors.style.display = '';
        return false;
    }

    /**
     * Display the calculation results
     *
     * @param   {Integer}  calories   The calories burned
     * @param   {Integer}  distance   The distance run
     * @param   {String}   unit       The distance unit (miles or kilometers)
     * @param   {Integer}  burnRate   The calories per distance burn rate
     * @param   {Integer}  calsPerHr  The calories burned per hour
     */
    function showResults(calories, distance, unit, burnRate, calsPerHr) {

      
        results.innerHTML = `<p>You burned <strong>${calories} calories</strong> on your  <strong>${distance} ${unit} run </strong>. At that pace, your calorie burn rate is  <strong>${burnRate} calories </strong> per mile and   <strong>${calsPerHr} calories  </strong>per hour.</p><a href="#" id="rs">reset</a>`;
      
      
      results.style.display = ''
      form.style.display = 'none'
      errors.style.display = 'none'
    }

  
    /**
     * Hide the results and reset the form
     */
    function resetForm(e) {
      if(e.target.id = 'rs') {
        e.preventDefault();
        results.style.display = 'none';
        form.style.display = '';
        form.reset()
      }
    }

    /**
     * Handle form submit
     */
    function submitHandler(e) {
        e.preventDefault();

        // Distance
        let distance = parseFloat(form.distance.value);
        let unit = form.distance_unit.value;
        if(isNaN(distance) || distance < 0) {
            return errorMessage('Please enter a valid distance');
        }
        if(unit == 'mile') {
            distance = 1.60934 * distance
        }
        if (distance < 0.1 || distance > 1000) {
            return errorMessage('The distance you entered falls outside the limits of this calculator.');
        }

        // Duration
        let hrs = (parseInt(form.time_h.value) || 0) * 3600;
        let min = (parseInt(form.time_m.value) || 0) * 60;
        let sec = (parseInt(form.time_s.value) || 0);
        console.log(hrs, min, sec);
        let duration = hrs + min + sec;
        if(isNaN(duration) || duration <= 0) {
            return errorMessage('Please enter a valid time')
        }

        // Pace
        let pace = duration / distance
        if (pace < 140 || pace > 1200) {
            return errorMessage('The pace calculated from the distance and time you entered falls outside the limits of this calculator.')
        }

        // Weight
        let weight = parseInt(form.weight.value)
        if(isNaN(weight) || weight <= 0) {
            return errorMessage('Please enter a valid weight')
        }

        if(form.weight_unit.value == 'lb') {
            weight = 0.453592 * weight;
        }
        if (weight < 35 || weight > 250) {
            return errorMessage('The weight that you entered falls outside the limits of this calculator.');
        }

        // Calculations
      console.log(weight);
        let calories = Math.round(distance * weight * 1.036);
        let calsPerKm = Math.round(weight * 1.036);
        let calsPerMi = Math.round(1.60934 * weight * 1.036);
        let calsPerHr = Math.round((distance * weight * 1.036) * (3600 / duration));
        let burnRate = (unit == 'mile' ? calsPerMi : calsPerKm);

        // Display results
        showResults(calories, parseFloat(form.distance.value), unit, burnRate, calsPerHr);
    }

    // Add Event Listeners
    form.addEventListener('submit', submitHandler);
    results.addEventListener('click', resetForm, true);

})();