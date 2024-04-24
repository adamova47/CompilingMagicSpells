# essentially returns a list of HTML-ready strings, each representing a publication in formatted manner
def format_publications(data):
    # list containing all the formatted publication entries
    formatted_data = []
    for entry in data:
        formatted_entry = ""
        author = entry['author'].replace('and', ',') if 'and' in entry['author'] else entry['author']
        title = entry['title']

        # handle articles
        if entry['ptype'] == "article":
            formatted_entry += f"{author}: {title}. <em>{entry.get('journal', '')}</em>"
            if entry.get('volume'):
                formatted_entry += f" {entry['volume']}"
            if entry.get('number'):
                formatted_entry += f"({entry['number']})."
            if entry.get('pages'):
                formatted_entry += f" {entry['pages']}."
            if entry.get('month'):
                formatted_entry += f" {entry['month']}."
            formatted_entry += f" {entry['year']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        # handle books and inbooks
        elif entry['ptype'] == "book" or entry['ptype'] == "inbook":
            formatted_entry += f"{author}: {title}"
            if entry.get('volume'):
                formatted_entry += f" (vol. {entry['volume']})"
            formatted_entry += ". "
            formatted_entry += entry['publisher']
            if entry.get('address'):
                formatted_entry += f", {entry['address']}."
            else:
                formatted_entry += ". "
            if entry.get('month'):
                formatted_entry += f" {entry['month']} "
            formatted_entry += f"{entry['year']}."
            if entry['ptype'] == "inbook" and entry.get('pages'):
                formatted_entry += f" pages: {entry['pages']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        elif entry['ptype'] == "mastersthesis" or entry['ptype'] == "phdthesis":
            formatted_entry += f"{author}: {title}. {entry['school']}"
            if entry.get('address'):
                formatted_entry += f", {entry['address']}. "
            else:
                formatted_entry += ". "
            if entry.get('month'):
                formatted_entry += f" {entry['month']} "
            formatted_entry += f"{entry['year']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        elif entry['ptype'] in ["conference", "incollection", "inproceedings"]:
            formatted_entry += f"{author}: {title}. In "
            if entry.get('editor'):
                formatted_entry += f" {entry['editor']} (eds.), "
            formatted_entry += f"<em> {entry['booktitle']} </em>"
            if entry.get('publisher'):
                formatted_entry += f", "
            else:
                formatted_entry += ". "
            if entry.get('publisher'):
                formatted_entry += entry['publisher']
                if entry.get('address'):
                    formatted_entry += f", {entry['address']}. "
                else:
                    formatted_entry += ". "
            if entry.get('pages'):
                formatted_entry += f"{entry['pages']}. "
            if entry.get('month'):
                formatted_entry += f"{entry['month']} "
            formatted_entry += f"{entry['year']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        elif entry['ptype'] == "techreport":
            formatted_entry += f"{author}: {title}. Technical report"
            if entry.get('number'):
                formatted_entry += f" {entry['number']}"
            formatted_entry += ". "
            formatted_entry += entry['institution']
            if entry.get('address'):
                formatted_entry += f", {entry['address']}. "
            else:
                formatted_entry += ". "
            if entry.get('month'):
                formatted_entry += f"{entry['month']} "
            formatted_entry += f"{entry['year']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        else:
            formatted_entry += f"{author}: {title}. "
            formatted_entry += f"{entry['year']}."
            if entry.get('note'):
                formatted_entry += f" {entry['note']}."

        if 'url' in entry and entry['url']:
            formatted_entry += (f'<a href="{entry["url"]}">'
                                f'<img src="assets/images/from_common/pdf.png" width="20" height="18" alt="pdf"/>'
                                f'</a>')

        # append a link to a bibliographic export
        formatted_entry += (f'<a href="/cnc/exportBib/{entry["id"]}" target="_blank">'
                            f'<img src="assets/images/from_common/bibtex-icon.png" width="20" height="18" alt="bib"/>'
                            f'</a>')

        formatted_data.append(formatted_entry)
    return formatted_data


bibTypesArr = {
    "article": ["author", "title", "year", "pages", "month", "note", "journal", "volume", "number"],
    "book": ["author", "title", "year", "editor", "publisher", "series", "address", "edition", "pages", "note"],
    "inbook": ["author", "title", "year", "editor", "publisher", "series", "address", "edition", "pages", "note"],
    "conference": ["author", "title", "booktitle", "year", "editor", "publisher", "series", "address", "organization",
                   "pages", "note"],
    "incollection": ["author", "title", "year", "editor", "series", "address", "edition", "booktitle", "organization",
                     "pages", "note"],
    "inproceedings": ["author", "title", "booktitle", "year", "editor", "publisher", "series", "address",
                      "organization", "pages", "note"],
    "mastersthesis": ["author", "title", "school", "year", "pages", "note"],
    "phdthesis": ["author", "title", "school", "year", "pages", "note"],
    "techreport": ["author", "title", "institution", "year", "pages", "note"],
    "misc": ["author", "title", "year", "month", "note"],
    "unpublished": ["author", "title", "year", "month", "note"]
}


def format_publication_for_bibtex(publication):
    attributes = bibTypesArr[publication.ptype]
    formatted_bib = f"@{publication.ptype}{{ {publication.name},<br/>"

    for att in attributes:
        value = getattr(publication, att, "")
        if value:
            if att in ["author", "title"]:
                formatted_value = f"{{{{ {value} }}}}"
            else:
                formatted_value = f"{{{value}}}"
            formatted_bib += f"{att} = {formatted_value},<br/>"

    formatted_bib = formatted_bib.rstrip(',<br/>') + "<br/>}"
    return formatted_bib


