/**
 * Maps MBTA stop IDs to SVG coordinates on the transit map
 *
 * Coordinate system: 826x770 viewBox
 * Use /map-editor to interactively map stations
 */

export const STATION_COORDS: { [key: string]: { x: number; y: number } } = {
  // Green-E Line
  "place-rvrwy": { x: 292.7, y: 442.8 }, // Riverway
  "place-bckhl": { x: 282.7, y: 451.3 }, // Back of the Hill
  "place-hsmnl": { x: 268.3, y: 466.4 }, // Heath Street
  "place-mfa": { x: 348.3, y: 385.2 }, // Museum of Fine Arts
  "place-nuniv": { x: 359.7, y: 375.7 }, // Northeastern University
  "place-symcl": { x: 367.7, y: 365.6 }, // Symphony
  "place-prmnl": { x: 370, y: 333.7 }, // Prudential
  "place-boyls": { x: 471.3, y: 293.7 }, // Boylston
  "place-armnl": { x: 430.3, y: 298.7 }, // Arlington
  "place-coecl": { x: 394.3, y: 299.5 }, // Copley
  "place-mispk": { x: 304.7, y: 429.6 }, // Mission Park
  "place-fenwd": { x: 315.7, y: 418.3 }, // Fenwood Road
  "place-brmnl": { x: 325.7, y: 406.3 }, // Brigham Circle
  "place-lngmd": { x: 338, y: 397.2 }, // Longwood Medical Area
  // "place-gover": { x: 535.5, y: 229.4 }, // Government Center
  // "place-haecl": { x: 556.5, y: 198.3 }, // Haymarket
  // "place-north": { x: 556, y: 176.6 }, // North Station
  "place-spmnl": { x: 545.3, y: 155.2 }, // Science Park/West End
  "place-lech": { x: 528, y: 137.8 }, // Lechmere
  "place-esomr": { x: 485.3, y: 95.4 }, // East Somerville
  "place-gilmn": { x: 465.3, y: 74.7 }, // Gilman Square
  "place-mgngl": { x: 446, y: 55.5 }, // Magoun Square
  "place-balsq": { x: 425.7, y: 35.9 }, // Ball Square
  "place-mdftf": { x: 407.3, y: 17.6 }, // Medford/Tufts

  // Orange Line
  "place-forhl": { x: 268.6, y: 567.7 }, // Forest Hills
  "place-grnst": { x: 295.5, y: 540.1 }, // Green Street
  "place-sbmnl": { x: 321.7, y: 513.5 }, // Stony Brook
  "place-jaksn": { x: 349.4, y: 485.5 }, // Jackson Square
  "place-rcmnl": { x: 376.6, y: 459.6 }, // Roxbury Crossing
  "place-rugg": { x: 398.8, y: 437.9 }, // Ruggles
  "place-masta": { x: 419.2, y: 416.6 }, // Massachusetts Avenue
  "place-bbsta": { x: 441, y: 395 }, // Back Bay
  "place-chncl": { x: 506.1, y: 330.1 }, // Chinatown
  "place-tumnl": { x: 473.4, y: 362 }, // Tufts Medical Center
  "place-state": { x: 566, y: 257.8 }, // State
  "place-haecl": { x: 560, y: 198.7 }, // Haymarket
  "place-north": { x: 560.5, y: 176.7 }, // North Station
  "place-ccmnl": { x: 566.5, y: 110.8 }, // Community College
  "place-sull": { x: 566, y: 87.5 }, // Sullivan Square
  "place-astao": { x: 566.5, y: 65.1 }, // Assembly
  "place-welln": { x: 567, y: 40.3 }, // Wellington
  "place-mlmnl": { x: 567, y: 18.4 }, // Malden Center
  "place-ogmnl": { x: 567, y: -4.5 }, // Oak Grove

  // Red Line
  "place-pktrm": { x: 503, y: 262.3 }, // Park Street
  "place-alfcl": { x: 291.4, y: 50.3 }, // Alewife
  "place-davis": { x: 322.6, y: 81.8 }, // Davis
  "place-portr": { x: 352.2, y: 111.5 }, // Porter
  "place-harsq": { x: 381.4, y: 140.4 }, // Harvard
  "place-cntsq": { x: 411, y: 168.2 }, // Central
  "place-knncl": { x: 438.6, y: 196.8 }, // Kendall/MIT
  "place-chmnl": { x: 474.2, y: 231.6 }, // Charles/MGH
  "place-dwnxg": { x: 538.2, y: 297.1 }, // Downtown Crossing
  "place-sstat": { x: 573, y: 331.5 }, // South Station
  "place-brdwy": { x: 601, y: 409.2 }, // Broadway
  "place-andrw": { x: 600.2, y: 442.9 }, // Andrew
  "place-jfk": { x: 600.2, y: 476.5 }, // JFK/UMass
  "place-shmnl": { x: 563.8, y: 567.3 }, // Savin Hill
  "place-smmnl": { x: 563.4, y: 598.5 }, // Shawmut
  "place-fldcr": { x: 563.4, y: 582.4 }, // Fields Corner
  // "place-asmnl": { x: 563, y: 614.6 }, // Ashmont
  "place-nqncy": { x: 653, y: 573.2 }, // North Quincy
  "place-wlsta": { x: 676.6, y: 597.7 }, // Wollaston
  "place-qnctr": { x: 700.6, y: 619.3 }, // Quincy Center
  "place-qamnl": { x: 717.4, y: 645.3 }, // Quincy Adams
  "place-brntn": { x: 718.6, y: 679.8 }, // Braintree

  // Mattapan Line
  "place-cedgr": { x: 564.3, y: 641.6 }, // Cedar Grove
  "place-asmnl": { x: 563.5, y: 618.7 }, // Ashmont
  "place-butlr": { x: 561.7, y: 660.3 }, // Butler
  "place-miltt": { x: 542.5, y: 661.6 }, // Milton
  "place-cenav": { x: 525.7, y: 662 }, // Central Avenue
  "place-valrd": { x: 507.9, y: 662.3 }, // Valley Road
  "place-capst": { x: 491.2, y: 662.3 }, // Capen Street
  "place-matt": { x: 473.4, y: 662 }, // Mattapan


// Blue Line
  "place-gover": { x: 535.5, y: 229.4 }, // Government Center
  "place-bomnl": { x: 513, y: 209.2 }, // Bowdoin
  "place-aqucl": { x: 598.5, y: 229.5 }, // Aquarium
  "place-mvbcl": { x: 642.8, y: 185.3 }, // Maverick
  "place-aport": { x: 665.7, y: 163 }, // Airport
  "place-wimnl": { x: 688.3, y: 139.7 }, // Wood Island
  "place-orhte": { x: 710.8, y: 117 }, // Orient Heights
  "place-sdmnl": { x: 732.6, y: 95.1 }, // Suffolk Downs
  "place-bmmnl": { x: 755.2, y: 72.8 }, // Beachmont
  "place-rbmnl": { x: 778.1, y: 49.1 }, // Revere Beach
  "place-wondl": { x: 800.6, y: 27.5 }, // Wonderland

// Green-D Line
  "place-river": { x: 130.7, y: 477.2 }, // Riverside
  "place-woodl": { x: 145.7, y: 462.8 }, // Woodland
  "place-waban": { x: 157.3, y: 449.1 }, // Waban
  "place-eliot": { x: 171, y: 436.6 }, // Eliot
  "place-newtn": { x: 184.3, y: 423.1 }, // Newton Highlands
  "place-newto": { x: 197.7, y: 410.6 }, // Newton Centre
  "place-chhil": { x: 210.7, y: 397.2 }, // Chestnut Hill
  "place-rsmnl": { x: 224.3, y: 383.8 }, // Reservoir
  "place-bcnfd": { x: 237.3, y: 371.3 }, // Beaconsfield
  "place-brkhl": { x: 249.3, y: 357.5 }, // Brookline Hills
  "place-bvmnl": { x: 262.7, y: 345 }, // Brookline Village
  "place-longw": { x: 275.7, y: 330.7 }, // Longwood
  "place-fenwy": { x: 289.7, y: 317.9 }, // Fenway
  "place-kencl": { x: 322.7, y: 298.6 }, // Kenmore
  "place-hymnl": { x: 359, y: 298 }, // Hynes Convention Center
  "place-unsqu": { x: 466.7, y: 124.1 }, // Union Square

  // Green-C Line
  "place-clmnl": { x: 95, y: 389 }, // Cleveland Circle
  "place-engav": { x: 109, y: 374.6 }, // Englewood Avenue
  "place-denrd": { x: 122.3, y: 360.9 }, // Dean Road
  "place-tapst": { x: 135, y: 348.1 }, // Tappan Street
  "place-bcnwa": { x: 148, y: 334 }, // Washington Square
  "place-fbkst": { x: 162, y: 321.8 }, // Fairbanks Street
  "place-bndhl": { x: 175.3, y: 308.7 }, // Brandon Hall
  "place-sumav": { x: 188.7, y: 294.4 }, // Summit Avenue
  "place-cool": { x: 201.7, y: 282.5 }, // Coolidge Corner
  "place-stpul": { x: 214.7, y: 269.7 }, // Saint Paul Street
  "place-kntst": { x: 233.7, y: 259.3 }, // Kent Street
  "place-hwsst": { x: 252.3, y: 269 }, // Hawes Street
  "place-smary": { x: 265, y: 280.9 }, // Saint Mary's Street

  // Green-B Line
  "place-lake": { x: 63.2, y: 308.5 }, // Boston College
  "place-sougr": { x: 77, y: 294.7 }, // South Street
  "place-chill": { x: 90.3, y: 280.9 }, // Chestnut Hill Avenue
  "place-chswk": { x: 103.3, y: 267.8 }, // Chiswick Road
  "place-sthld": { x: 117, y: 254.7 }, // Sutherland Road
  "place-wascm": { x: 130, y: 241.3 }, // Washington Street
  "place-wrnst": { x: 143.3, y: 227.6 }, // Warren Street
  "place-alsgr": { x: 156.7, y: 214.7 }, // Allston Street
  "place-grigg": { x: 170, y: 202.8 }, // Griggs Street
  "place-harvd": { x: 191, y: 189.1 }, // Harvard Avenue
  "place-brico": { x: 213, y: 202.5 }, // Packard's Corner
  "place-babck": { x: 227, y: 216.6 }, // Babcock Street
  "place-amory": { x: 239, y: 227.9 }, // Amory Street
  "place-buest": { x: 266, y: 255 }, // Boston University East
  "place-bucen": { x: 252, y: 242.2 }, // Boston University Central
  "place-bland": { x: 280, y: 268.7 }, // Blandford Street

  // Map your stations using the interactive editor at /map-editor
  // Add coordinates here as you map them
};
