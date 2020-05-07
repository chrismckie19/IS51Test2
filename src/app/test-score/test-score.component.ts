import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number,
  testName?: string,
  pointsPossible?: number,
  pointsReceived?: number,
  percentage?: number,
  grade?: string
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();
  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
    } else {
      tests = await this.loadTestsFilesFromJson();
    }
    this.tests = tests;
    return tests;
  }

  async loadTestsFilesFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
    console.log("saveToLocalStorage works")
  }

  deleteTest(index, number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveTest() {
    this.saveToLocalStorage();
    this.toastService.showToast('success', 3000, 'Success! Items saved!')
  }

  computeGrade() {
    const data = this.calculate();
    this.router.navigate(['home', data]);
  }

  calculate() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    let grade = 0
    let letterGrade: string;
    for (let i = 0; i < this.tests.length; i++) {
      pointsPossible += this.tests[i].pointsPossible;
      pointsReceived += this.tests[i].pointsReceived;
      grade += this.tests[i].pointsReceived / this.tests[i].pointsPossible;
    }
    if (grade > .9) {
      letterGrade === 'A';
    } else if (grade > .8) {
      letterGrade === 'B';
    } else if (grade > .7) {
      letterGrade === 'C';
    } else if (grade > .6) {
      letterGrade === 'D';
    } else letterGrade === 'F';
    return {
      numberOfTests: this.tests.length,
      pointsPossible: pointsPossible,
      pointsReceived: pointsReceived,
      percentage: pointsReceived / pointsPossible,
      grade: letterGrade
    };
  }

}
