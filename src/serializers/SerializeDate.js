const SerializeDate = stringDate => {
    let initDate = new Date(stringDate);
    let date = initDate.toLocaleDateString('ro-RO')

    return date;
}

export default SerializeDate;