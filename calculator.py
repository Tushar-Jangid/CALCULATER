def show_menu():
    print("\n" + "="*30)
    print("       SIMPLE CALCULATOR       ")
    print("="*30)
    print("Operations available:")
    print("  1. Add (+)")
    print("  2. Subtract (-)")
    print("  3. Multiply (*)")
    print("  4. Divide (/)")
    print("="*30)

def main():
    show_menu()
    
    # Get first number
    try:
        num1 = float(input("\nEnter the first number: "))
    except ValueError:
        print("Error: Invalid input. Please enter a valid numerical value.")
        return

    # Get operation choice
    choice = input("Choose an operation (1/2/3/4) or (+, -, *, /): ").strip()

    # Get second number
    try:
        num2 = float(input("Enter the second number: "))
    except ValueError:
        print("Error: Invalid input. Please enter a valid numerical value.")
        return

    print("-" * 30)
    
    # Perform calculation and display
    if choice in ('1', '+', 'add'):
        result = num1 + num2
        print(f"Result: {num1} + {num2} = {result}")
    elif choice in ('2', '-', 'subtract'):
        result = num1 - num2
        print(f"Result: {num1} - {num2} = {result}")
    elif choice in ('3', '*', 'multiply'):
        result = num1 * num2
        print(f"Result: {num1} * {num2} = {result}")
    elif choice in ('4', '/', 'divide'):
        if num2 == 0:
            print("Error: Cannot divide by zero!")
        else:
            result = num1 / num2
            print(f"Result: {num1} / {num2} = {result}")
    else:
        print("Error: Invalid operation choice! Please select a valid option.")
        
    print("-" * 30)

if __name__ == "__main__":
    while True:
        main()
        
        # Ask if the user wants to do another calculation
        retry = input("\nDo you want to perform another calculation? (yes/no): ").strip().lower()
        if retry not in ('yes', 'y'):
            print("Thank you for using the calculator. Goodbye!")
            break
