const v01_elem = document.getElementById('v01-in');
const v02_elem = document.getElementById('v02-out');

class Literal {
    constructor(value) {
        this.value = value;
    }

    to_v02() {
        return [this];
    }

    to_string() {
        return this.value.replace('%', '%%').replace('\\', '\\\\');
    }
}

class Specifier {
    constructor(letter, padding = null) {
        this.letter = letter;
        this.padding = padding;
    }

    to_v02() {
        if (this.letter === 'c') {
            return parse_v01('%a %b %_d %H:%M:%S %0Y');
        }
        if (this.letter === 'D' || this.letter === 'x') {
            return parse_v01('%m/%d/%y');
        }
        if (this.letter === 'e') {
            return parse_v01('%_d');
        }
        if (this.letter === 'F') {
            return parse_v01('%0Y-%m-%d');
        }
        if (this.letter === 'G') {
            return parse_v01('%0G');
        }
        if (this.letter === 'h') {
            return parse_v01('%b');
        }
        if (this.letter === 'k') {
            return parse_v01('%-H');
        }
        if (this.letter === 'l') {
            return parse_v01('%-I');
        }
        if (this.letter === 'n') {
            return parse_v01('\\n');
        }
        if (this.letter === 'p') {
            return parse_v01('%P');
        }
        if (this.letter === 'P') {
            return parse_v01('%p');
        }
        if (this.letter === 'r') {
            return parse_v01('%I:%M:%S %P');
        }
        if (this.letter === 'R') {
            return parse_v01('%H:%M');
        }
        if (this.letter === 't') {
            return parse_v01('\\t');
        }
        if (this.letter === 'T' || this.letter === 'X') {
            return parse_v01('%H:%M:%S');
        }
        if (this.letter === 'Y') {
            return parse_v01('%0Y');
        }
        if (this.letter === 'Z') {
            return parse_v01('GMT');
        }

        return [this];
    }

    to_string() {
        if (this.padding !== null) {
            return `%` + this.padding + this.letter;
        } else {
            return `%` + this.letter;
        }
    }
}

const padding = Object.freeze({
    default: '',
    none: '-',
    space: '_',
    zero: '0',
});

function parse_v01(s) {
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
    const v01_str = v01_elem.value;
    const items = parse_v01(v01_str);
    const v02_str = items.flatMap(item => item.to_v02()).map(item => item.to_string()).join('');
    v02_elem.value = v02_str;
}

v01_elem.addEventListener('keyup', convert);
