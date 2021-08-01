const v02_elem = document.getElementById('v02-in');
const v03_elem = document.getElementById('v03-out');

class Literal {
    constructor(value) {
        this.value = value;
    }

    to_v03_string() {
        return this.value.replace('[', '[[').replace('\\', '\\\\');
    }
}

class Specifier {
    constructor(letter, padding = null) {
        this.letter = letter;
        this.padding = padding;
    }

    to_v03_string() {
        if (this.letter === 'a') {
            return '[weekday repr:short]';
        }
        if (this.letter === 'A') {
            return '[weekday]';
        }
        if (this.letter === 'b') {
            return '[month repr:short]';
        }
        if (this.letter === 'B') {
            return '[month repr:long]';
        }
        if (this.letter === 'c') {
            return parse_v02('%a %b %-d %-H:%M:%S %-Y').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'd') {
            return `[day${this.padding}]`;
        }
        if (this.letter === 'D') {
            return parse_v02('%-m/%d/%y').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'F') {
            return parse_v02('%-Y-%m-%d').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'g') {
            return `[year repr:last_two base:iso_week${this.padding}]`;
        }
        if (this.letter === 'G') {
            return `[year base:iso_week${this.padding}]`;
        }
        if (this.letter === 'H') {
            return `[hour${this.padding}]`;
        }
        if (this.letter === 'I') {
            return `[hour repr:12${this.padding}]`;
        }
        if (this.letter === 'j') {
            return `[ordinal${this.padding}]`;
        }
        if (this.letter === 'm') {
            return '[month]';
        }
        if (this.letter === 'M') {
            return `[minute${this.padding}]`;
        }
        if (this.letter === 'N') {
            return '[subsecond digits:9]';
        }
        if (this.letter === 'p') {
            return '[period]';
        }
        if (this.letter === 'P') {
            return '[period case:upper]';
        }
        if (this.letter === 'r') {
            return parse_v02('%-I:%M:%S %p').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'R') {
            return parse_v02('%-H:%M').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'S') {
            return `[second${this.padding}]`;
        }
        if (this.letter === 'T') {
            return parse_v02('%-H:%M:%S').map(elem => elem.to_v03_string()).join('');
        }
        if (this.letter === 'u') {
            return `[weekday repr:monday one_indexed:true${this.padding}]`;
        }
        if (this.letter === 'U') {
            return `[week_number repr:sunday${this.padding}]`;
        }
        if (this.letter === 'V') {
            return `[week_number repr:iso${this.padding}]`;
        }
        if (this.letter === 'w') {
            return `[weekday repr:sunday one_indexed:false${this.padding}]`;
        }
        if (this.letter === 'W') {
            return `[week_number repr:monday${this.padding}]`;
        }
        if (this.letter === 'y') {
            return `[year repr:last_two${this.padding}]`;
        }
        if (this.letter === 'Y') {
            return `[year${this.padding}]`;
        }
        if (this.letter === 'z') {
            return '[offset_hour sign:mandatory][offset_minute]';
        }
        return '';
    }
}

const padding = Object.freeze({
    default: '',
    none: ' padding:none',
    space: ' padding:space',
    zero: '',
});

function parse_v02(s) {
    let items = [];

    while (true) {
        if (s.startsWith('%')) {
            s = s.substring(1);

            if (s === '') {
                break;
            }

            if (s.startsWith('%')) {
                items.push(new Literal('%'));
                s = s.substring(1);
            } else if (s.startsWith('-')) {
                items.push(new Specifier(s[1], padding.none));
                s = s.substring(2);
            } else if (s.startsWith('_')) {
                items.push(new Specifier(s[1], padding.space));
                s = s.substring(2);
            } else if (s.startsWith('0')) {
                items.push(new Specifier(s[1], padding.zero));
                s = s.substring(2);
            } else {
                items.push(new Specifier(s[0], padding.default));
                s = s.substring(1);
            }
        } else {
            let index = 0;

            while (s[index] !== '%' && s[index] !== undefined) {
                index++;
            }

            if (s[index - 1] === undefined) {
                break;
            }

            items.push(new Literal(s.substring(0, index)));
            s = s.substring(index);
        }
    }

    return items;
}

function convert() {
    const v02_str = v02_elem.value;
    const items = parse_v02(v02_str);
    const v03_str = items.flatMap(item => item.to_v03_string()).join('');
    v03_elem.value = v03_str;
}

v02_elem.addEventListener('keyup', convert);
