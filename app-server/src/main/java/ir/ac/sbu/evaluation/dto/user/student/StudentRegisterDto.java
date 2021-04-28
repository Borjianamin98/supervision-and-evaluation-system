package ir.ac.sbu.evaluation.dto.user.student;

import ir.ac.sbu.evaluation.model.user.Student;
import javax.validation.constraints.NotNull;
import lombok.Builder;

public class StudentRegisterDto {

    @NotNull
    private StudentDto student;

    @NotNull
    private long facultyId;

    public StudentRegisterDto() {
    }

    @Builder
    public StudentRegisterDto(StudentDto student, long facultyId) {
        this.student = student;
        this.facultyId = facultyId;
    }

    public static StudentRegisterDto from(Student student, long facultyId) {
        return builder()
                .student(StudentDto.from(student))
                .facultyId(facultyId)
                .build();
    }

    public StudentDto getStudent() {
        return student;
    }

    public void setStudent(StudentDto student) {
        this.student = student;
    }

    public long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(long facultyId) {
        this.facultyId = facultyId;
    }
}
