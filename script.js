function toggleCurrentGPAInput() {
    var selectedOption = document.getElementById('gpa-option').value;
    var currentGPAContainer = document.getElementById('current-gpa-container');
    currentGPAContainer.style.display = (selectedOption === 'both') ? 'block' : 'none';
}

function calculateRealTimeGPA() {
    var classInputs = document.querySelectorAll(".class-input");
    var totalCredits = 0;
    var totalGradePoints = 0;

    classInputs.forEach(function(classInput) {
        var credits = parseFloat(classInput.querySelector("input[type=number]").value);
        var grade = parseFloat(classInput.querySelector("select").value);

        // Increment total credits
        totalCredits += credits;
        // Increment total grade points
        totalGradePoints += credits * grade;
    });

    // Calculate GPA for new classes
    var newGPA = totalGradePoints / totalCredits;

    // Get selected option from dropdown
    var selectedOption = document.getElementById('gpa-option').value;

    // Calculate cumulative GPA if option is 'cumulative', 'current-cumulative', or 'both'
    var cumulativeGPA;
    if (selectedOption === 'cumulative' || selectedOption === 'both' || selectedOption === 'current-cumulative') {
        // Call calculateCumulativeGPA function to calculate cumulative GPA
        cumulativeGPA = calculateCumulativeGPA(totalCredits, totalGradePoints);
    }

    // Display GPAs based on selected option
    var gpaResultDiv = document.getElementById('gpa-result');
    if (selectedOption === 'current') {
        // Display current GPA only
        gpaResultDiv.textContent = "Your current GPA is: " + (isNaN(newGPA) ? "N/A" : newGPA.toFixed(2));
    } else if (selectedOption === 'cumulative') {
        // Display cumulative GPA only
        gpaResultDiv.textContent = "Your cumulative GPA is: " + (isNaN(cumulativeGPA) ? "N/A" : cumulativeGPA.toFixed(2));
    } else if (selectedOption === 'both') {
        // Display both current and cumulative GPAs
        gpaResultDiv.textContent = "Your current GPA is: " + (isNaN(newGPA) ? "N/A" : newGPA.toFixed(2)) + "<br>" +
                                     "Your cumulative GPA is: " + (isNaN(cumulativeGPA) ? "N/A" : cumulativeGPA.toFixed(2));
    }
}

function attachRealTimeListeners() {
    var classInputs = document.querySelectorAll(".class-input");

    classInputs.forEach(function(classInput) {
        var creditsInput = classInput.querySelector("input[type=number]");
        var gradeDropdown = classInput.querySelector("select");

        // Attach event listeners to detect changes in inputs
        creditsInput.addEventListener('input', calculateRealTimeGPA);
        gradeDropdown.addEventListener('change', calculateRealTimeGPA);
    });
}

function generateInputFields() {
    var numClasses = parseInt(document.getElementById('num-classes').value);
    var classInputsContainer = document.getElementById('class-inputs');
    classInputsContainer.innerHTML = ""; // Clear previous inputs

    // Define the mapping of letter grades to grade points
    var gradeMappings = {
        'A': 4,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1,
        'D-': 0.7,
        'F': 0
    };

    for (var i = 0; i < numClasses; i++) {
        var classDiv = document.createElement("div");
        classDiv.classList.add("class-input");

        var classLabel = document.createElement("label");
        classLabel.textContent = "Class " + (i + 1) + ":";
        classDiv.appendChild(classLabel);

        var classNameInput = document.createElement("input");
        classNameInput.type = "text";
        classNameInput.placeholder = "Class Name";
        classDiv.appendChild(classNameInput);

        var creditsInput = document.createElement("input");
        creditsInput.type = "number";
        creditsInput.placeholder = "Credit Hours";
        classDiv.appendChild(creditsInput);

        var gradeDropdown = document.createElement("select");
        gradeDropdown.name = "grade" + (i + 1);

        // Populate the dropdown with options for grades
        for (var grade in gradeMappings) {
            var option = document.createElement("option");
            option.value = gradeMappings[grade];
            option.text = grade;
            gradeDropdown.appendChild(option);
        }

        classDiv.appendChild(gradeDropdown);

        // Add error message element
        var errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red";
        classDiv.appendChild(errorMessage);

        classInputsContainer.appendChild(classDiv);
    }

    // Attach real-time listeners after generating input fields
    attachRealTimeListeners();
}

function calculateCumulativeGPA(totalCreditsNew, totalGradePointsNew) {
    var currentGPA = parseFloat(document.getElementById('current-gpa').value);
    var currentCredits = totalCreditsNew;
    var currentGradePoints = currentGPA * currentCredits;

    var totalCreditsCumulative = totalCreditsNew + currentCredits;
    var totalGradePointsCumulative = totalGradePointsNew + currentGradePoints;

    // Calculate cumulative GPA
    var cumulativeGPA = totalGradePointsCumulative / totalCreditsCumulative;

    return cumulativeGPA;
}

window.onload = function() {
    // Call toggleCurrentGPAInput to show/hide the current GPA input box based on the selected option
    toggleCurrentGPAInput();
}
