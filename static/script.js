class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        document.querySelector('.display').classList.remove('error');
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error') this.clear();
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Remove leading zero unless it's for a decimal
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation, operationSymbol) {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute().then(() => {
                this.operation = operation;
                this.operationSymbol = operationSymbol;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            });
            return;
        }
        
        this.operation = operation;
        this.operationSymbol = operationSymbol;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    async compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // If we don't have both parts, don't compute
        if (isNaN(prev) || isNaN(current)) return;

        try {
            document.querySelector('.display').classList.remove('error');
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    num1: prev,
                    num2: current,
                    operation: this.operation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                this.currentOperand = data.error || 'Error';
                document.querySelector('.display').classList.add('error');
            } else {
                let res = data.result;
                // Format output
                if (!Number.isInteger(res) && typeof res === 'number') {
                    res = parseFloat(res.toFixed(8));
                }
                this.currentOperand = res.toString();
            }
        } catch (error) {
            this.currentOperand = 'Error';
            document.querySelector('.display').classList.add('error');
            console.error(error);
        }

        this.operation = undefined;
        this.operationSymbol = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operationSymbol}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');
    
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    const numberButtons = document.querySelectorAll('.num-btn');
    const operationButtons = document.querySelectorAll('.op-btn');
    const equalsButton = document.querySelector('.eq-btn');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const clearButton = document.querySelector('[data-action="clear"]');

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operation'), button.innerText);
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', async () => {
        await calculator.compute();
        calculator.updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });
});
