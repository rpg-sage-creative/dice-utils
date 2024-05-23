default target ("VS") = 8

roll Xd12

for each die:
     1: -1 success
  < VS:  0 successes
   VS+: +1 success
    12: +1 success and crit die

for each crit die:
  < VS: +1 success
   VS+: +2 successes and crit die

final success/failure
   1+: success
    0: failure
  < 0: critical failure